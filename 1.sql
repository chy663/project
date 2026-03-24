-- 修改酒店表列名以匹配后端实体类映射

UPDATE hotel SET admin_id = 2 WHERE id = 1;   
UPDATE hotel SET admin_id = 3 WHERE id = 2;           
UPDATE hotel SET admin_id = 4 WHERE id = 3;           
UPDATE hotel SET admin_id = 5 WHERE id = 4;           
UPDATE hotel SET admin_id = 6 WHERE id = 5;   


  select * from orders;
  SELECT * FROM room where id=1 ;
  SELECT * FROM hotel WHERE id = 1;
  SELECT * FROM users WHERE id = 1;
  SHOW CREATE TABLE orders;
  
  ALTER TABLE orders 
ADD CONSTRAINT fk_order_users 
FOREIGN KEY (user_id) REFERENCES users(id);
  
  SET SQL_SAFE_UPDATES = 0;

UPDATE hotel 
SET description = 'This hotel primarily caters to students and those on a budget. The facilities are basic, offering only essential services, but the price is affordable, making it a good choice for students on a budget or for short-term stays.' 
WHERE id = 5;

-- 3. (可选) 操作完成后恢复安全模式，保护数据安全
SET SQL_SAFE_UPDATES = 1;

  select * from favorites;
  select * from hotel;
  
  
  DESCRIBE orders;
  ALTER TABLE reviews DROP FOREIGN KEY fk_order_user;
 -- 更新 Hotel A (ID: 1)
UPDATE hotel SET capacity = '2 Persons', max_capacity = 2, price = '450-380' WHERE id = 1;

-- 更新 Hotel B (ID: 2)
UPDATE hotel SET capacity = '4-6 Persons', max_capacity = 6, price = '350-420' WHERE id = 2;

-- 更新 Hotel C (ID: 3)
UPDATE hotel SET capacity = '2 Persons', max_capacity = 2, price = '390-550' WHERE id = 3;

-- 更新 Hotel D (ID: 4)
UPDATE hotel SET capacity = '2-3 Persons', max_capacity = 3, price = '150-220' WHERE id = 4;

-- 更新 Hotel E (ID: 5)
UPDATE hotel SET capacity = '1-2 Persons', max_capacity = 2, price = '55-65' WHERE id = 5;

ALTER TABLE room DROP COLUMN room_number ;