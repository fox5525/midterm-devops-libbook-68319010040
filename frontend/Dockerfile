# 1. ใช้ Nginx ซึ่งเป็น Web Server ความเร็วสูงสำหรับเสิร์ฟหน้าเว็บ
FROM nginx:alpine

# 2. ก๊อปปี้ไฟล์หน้าเว็บ index.html ของเรา ไปวางในโฟลเดอร์ทำงานของ Nginx
COPY index.html /usr/share/nginx/html/index.html

# 3. บอกกล่องว่าให้เปิดช่องทางสื่อสารที่พอร์ต 80
EXPOSE 80

# 4. สั่งให้ Nginx รันทำงานค้างไว้
CMD ["nginx", "-g", "daemon off;"]