/** @format */

import React, {useEffect, useState} from 'react';
import styles from './mybooking.module.scss';
import {Popconfirm} from 'antd';

import {Table} from 'antd';
import {deleteBooking, getMyBooking} from '@/api/Booking';
import {useSelector} from 'react-redux';
import {FormatDate} from '@/utils/utils';
import Message from '@/utils/Message';
import {useRouter} from 'next/navigation';

export default function MyBooking() {
   const [data, setData] = useState();
   const user = useSelector((state) => state.user);
   const [loading, setLoading] = useState(false);
   const router = useRouter();
   const [tableParams, setTableParams] = useState({
      pagination: {
         current: 1,
         pageSize: 10,
      },
   });
   const handleTableChange = (pagination, filters, sorter) => {
      setTableParams({
         pagination,
         filters,
         ...sorter,
      });

      // `dataSource` is useless since `pageSize` changed
      if (pagination.pageSize !== tableParams.pagination?.pageSize) {
         setData([]);
      }
   };
   const fetchData = async () => {
      setLoading(true);
      const res = await getMyBooking(
         {
            page: tableParams.pagination.current,
            limit: tableParams.pagination.pageSize,
         },
         user.token,
      );
      setData(res.data);
      setLoading(false);
      setTableParams({
         ...tableParams,
         pagination: {
            ...tableParams.pagination,
            total: res.total,
         },
      });
   };
   useEffect(() => {
      fetchData();
   }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

   const columns = [
      {
         title: 'Tour',
         dataIndex: 'nameTour',
         width: 200,
         align: 'center',
      },
      {
         title: 'Người booking',
         dataIndex: 'nameUserBooking',
         width: 200,
         align: 'center',
      },
      {
         title: 'Số điện thoại',
         dataIndex: 'phoneUserBooking',
         width: 200,
         align: 'center',
      },

      {
         title: 'Số  người tham gia',
         dataIndex: 'quantityGroup',
         width: 200,
         align: 'center',
      },

      {
         title: 'Giá',
         dataIndex: 'price',
         align: 'center',
         width: 100,
         render: (price) => `${price} VND`,
      },
      {
         title: 'Ngày booking',
         dataIndex: 'startDate',
         width: 200,
         align: 'center',
         render: (text) => FormatDate(text),
      },
      {
         title: 'Trạng thái',
         dataIndex: 'paid',
         align: 'center',
         render: (paid) => (paid ? 'Đã thanh toán' : 'Chưa thanh toán'),
      },

      {
         title: 'Hành động',
         dataIndex: 'action',
         align: 'center',
         render: (_, record) => (
            <div style={{display: 'flex', gap: 20}}>
               <div>
                  <a onClick={() => router.push(`/tour/${record.tour.slug}`)}>Xem tour</a>
               </div>
               <div>
                  <a>Đánh giá</a>
               </div>
               {data.length >= 1 ? (
                  <Popconfirm title='Sure to delete?' onConfirm={() => handleDelete(record._id)}>
                     <a style={{color: 'red'}}>Delete</a>
                  </Popconfirm>
               ) : null}
            </div>
         ),
      },
   ];
   const handleDelete = async (id) => {
      const res = await deleteBooking(id, user.token);
      if (res?.status == 204) {
         new Message('Xóa Booking thành công!').success();
         fetchData();
      }
   };

   return (
      <div>
         <div className={styles.form_container}>
            <div className={styles.heading_secondary}>My Bookings </div>
            <div className={styles.table_container}>
               <Table
                  columns={columns}
                  rowKey={(record) => record._id}
                  dataSource={data}
                  pagination={tableParams.pagination}
                  loading={loading}
                  onChange={handleTableChange}
                  className={styles.table}
                  scroll={{
                     x: 1500,
                  }}
               />
            </div>
         </div>
      </div>
   );
}
