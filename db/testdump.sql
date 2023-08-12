CREATE TABLE Student(
	student_id INT PRIMARY KEY AUTO_INCREMENT,
	student_name VARCHAR(60),
	student_age INT
);

INSERT INTO Student(student_name, student_age) VALUES("JayFate", 21);
INSERT INTO Student(student_name, student_age) VALUES("张三", 23);

ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'root';

flush privileges;
