-- V1022: Update all user passwords to a stronger default
-- New password: 'MyIslandStrongPass1!'
-- Hash generated via bcrypt: $2a$10$RZz2vIffdZEbfOFHyEzeKue/I9ABt5KsOETcgOPM4hlsGtswmubcq

UPDATE users
SET password_hash = '$2a$10$RZz2vIffdZEbfOFHyEzeKue/I9ABt5KsOETcgOPM4hlsGtswmubcq';
