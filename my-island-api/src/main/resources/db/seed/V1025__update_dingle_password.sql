-- V1025: Update Dingle Kayak Adventures password to something stronger
-- New Password: W@v3R!d3r$K3rrry#2026
-- Generated via BCrypt

UPDATE users SET password_hash = '$2a$10$zZAtrPL.nvehaAoiTr0BaemSR2QJ9I6bCIetewgWebDFNLEoe9MeW' WHERE email = 'hello@dinglekayak.ie';
