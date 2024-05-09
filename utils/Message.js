/** @format */

const {message} = require('antd');

class Message {
   constructor(content) {
      this.content = content;
   }

   success = () => {
      message.success(this.content);
   };

   error = () => {
      message.error(this.content);
   };

   warning = () => {
      message.warning(this.content);
   };
}
export default Message;
