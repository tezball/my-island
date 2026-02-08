-- V1023: Update test users with unique strong passwords
-- Generated via BCrypt

-- Nore Valley Park
UPDATE users SET password_hash = '$2a$10$J8646JruMvxlab9G2OX3AuR6W4clr.fO4fCaAy7jHKonRw7MUsin6' WHERE email = 'norevalley@myisland.com';

-- Burren Glamping Village
UPDATE users SET password_hash = '$2a$10$HfBRwGRcunuAp6yVKlrXluqJup1CjxleHpl1JnWjA9SltW2Uii6Q.' WHERE email = 'hello@burrenglampingvillage.ie';

-- Green Acres Farm Shop
UPDATE users SET password_hash = '$2a$10$VcaR8Qz7QG4ATP.uZNY6P.RLd.PoV.lN6sfibotMCwmCj.Ecu9hKi' WHERE email = 'farmshop@greenacres.ie';

-- Aillwee Farm Shop
UPDATE users SET password_hash = '$2a$10$VDqSdLNMLVhE53W8FYDiOuWabxT0WmHbe9mMdrIMLIY.kX1PNItC.' WHERE email = 'info@aillweefarmshop.ie';

-- Murphy General Store
UPDATE users SET password_hash = '$2a$10$O3HYVfBOUeSHNpb0VvebT.2XJUlACtmOM5Ud7U0nZ.aY.UCnbiK2e' WHERE email = 'info@murphygeneralstore.ie';

-- Lough Derg Lakeside
UPDATE users SET password_hash = '$2a$10$ubRgtTgT4904858PtST58.Lhk9UNWdknhzsT6bkWnXqum8DVsg.PW' WHERE email = 'bookings@loughdergcamping.ie';

-- Dingle Kayak Adventures
UPDATE users SET password_hash = '$2a$10$4edGvFCk2Xlomz3H7qtseeIqCb9iCY7vUje6mn0OoRVFuZ.eDpDaO' WHERE email = 'hello@dinglekayak.ie';

-- Murphy Family
UPDATE users SET password_hash = '$2a$10$l2G9U93lapd3.uFIXlmW9.EtwbMs58C0EqtigK8Ok7TEERRf6PrIC' WHERE email = 'family@example.com';
