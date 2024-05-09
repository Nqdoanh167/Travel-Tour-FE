/** @format */

export const ConvertRole = (role) => {
   if (role === 'admin') {
      return 'Admin';
   } else if (role === 'lead-guide') {
      return 'Hướng dẫn viên trưởng';
   } else if (role === 'guide') {
      return 'Hướng dẫn viên';
   } else {
      return 'User';
   }
};
export const FormatDate = (dateString) => {
   const date = new Date(dateString);
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần cộng thêm 1
   const day = String(date.getDate()).padStart(2, '0');
   return `${year}-${month}-${day}`;
};
