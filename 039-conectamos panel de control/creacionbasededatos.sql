CREATE DATABASE significadocanciones;
USE significadocanciones;

CREATE USER 'significadocanciones'@'localhost' 
IDENTIFIED BY 'significadocanciones';

GRANT USAGE ON *.* TO 'significadocanciones'@'localhost' 
REQUIRE NONE 
WITH MAX_QUERIES_PER_HOUR 0 
MAX_CONNECTIONS_PER_HOUR 0 
MAX_UPDATES_PER_HOUR 0 
MAX_USER_CONNECTIONS 0;

GRANT ALL PRIVILEGES 
ON `significadocanciones`.* 
TO 'significadocanciones'@'localhost';

CREATE TABLE `significadocanciones`.`usuarios` 
(
    `Identificador` INT(255) NOT NULL AUTO_INCREMENT , 
    `usuario` VARCHAR(50) NOT NULL , 
    `contrasena` VARCHAR(50) NOT NULL , 
    `nombrecompleto` VARCHAR(200) NOT NULL , 
    PRIMARY KEY (`Identificador`)
) ENGINE = InnoDB;

CREATE TABLE `significadocanciones`.`canciones` 
(
    `Identificador` INT(255) NOT NULL AUTO_INCREMENT , 
    `titulo` VARCHAR(255) NOT NULL ,
    `artista` VARCHAR(255) NOT NULL , 
    `significado` TEXT NOT NULL , 
    `usuarios_usuario` INT(255) NOT NULL , 
    PRIMARY KEY (`Identificador`)
) ENGINE = InnoDB;

ALTER TABLE `canciones` 
ADD CONSTRAINT `cancionesausuarios` 
FOREIGN KEY (`usuarios_usuario`) 
REFERENCES `usuarios`(`Identificador`) 
ON DELETE RESTRICT 
ON UPDATE RESTRICT;

INSERT INTO `usuarios` 
(
    `Identificador`, 
    `usuario`, 
    `contrasena`, 
    `nombrecompleto`
) VALUES (
    NULL, 
    'jocarsa', 
    'jocarsa', 
    'Jose Vicente Carratala Sanchis'
);

INSERT INTO `significadocanciones`.`canciones` (titulo, artista, significado, usuarios_usuario) VALUES 
('Solamente tu', 'Pablo Alborán', 'canción romántica que expresa la profunda admiración y amor que siente el protagonista hacia una persona especial', 1),
('Rock your body', 'Justin Timberlake', 'es una canción divertida y energizante que habla sobre disfrutar el momento en una fiesta o en la pista de baile', 1),
('Bohemian Rhapsody', 'Queen', 'canción épica que narra el conflicto interno de una persona tras cometer un crimen', 1),
('Wonderwall', 'Oasis', 'canción icónica que habla sobre la esperanza de que una persona especial pueda salvar o cambiar la vida del protagonista', 1),
('Shape of You', 'Ed Sheeran', 'una canción pegajosa y romántica que describe la atracción física entre dos personas y cómo se conectan a través de ella', 1),
('Rolling in the Deep', 'Adele', 'canción poderosa que habla sobre la traición, la venganza y el dolor tras el final de una relación amorosa', 1),
('Hotel California', 'Eagles', 'canción metafórica que explora los peligros de la tentación y la adicción en un entorno aparentemente encantador', 1),
('Smells Like Teen Spirit', 'Nirvana', 'himno del grunge que captura la frustración y la apatía de la juventud durante los años 90', 1),
('Billie Jean', 'Michael Jackson', 'canción que relata la angustia de una relación complicada en la que una mujer acusa al protagonista de ser el padre de su hijo', 1),
('Imagine', 'John Lennon', 'canción utópica que sueña con un mundo de paz, sin divisiones religiosas, políticas o sociales', 1),
('Despacito', 'Luis Fonsi ft. Daddy Yankee', 'canción pegajosa que habla de una conexión romántica y apasionada entre dos personas', 1),
('Someone Like You', 'Adele', 'canción melancólica sobre la aceptación y el dolor tras la pérdida de un amor', 1),
('Stairway to Heaven', 'Led Zeppelin', 'una canción mística y profunda que toca temas de la espiritualidad y el viaje de la vida', 1),
('Hey Jude', 'The Beatles', 'una canción de consuelo y apoyo a alguien que está pasando por un momento difícil', 1),
('Hallelujah', 'Leonard Cohen', 'canción que mezcla elementos religiosos con temas de amor, desesperación y redención', 1),
('Like a Rolling Stone', 'Bob Dylan', 'una crítica social y personal sobre una caída en desgracia y la pérdida de estatus', 1),
('Thriller', 'Michael Jackson', 'canción que combina elementos de horror y diversión, narrando una historia misteriosa', 1),
('I Will Always Love You', 'Whitney Houston', 'una balada poderosa sobre el amor eterno y la despedida', 1),
('Back to Black', 'Amy Winehouse', 'una canción que refleja el dolor emocional tras una ruptura amorosa', 1),
('Uptown Funk', 'Mark Ronson ft. Bruno Mars', 'canción divertida y energética que celebra el estilo, la confianza y el éxito', 1),
('Let it Be', 'The Beatles', 'canción que transmite paz y aceptación ante los problemas de la vida', 1),
('Born to Run', 'Bruce Springsteen', 'canción sobre la libertad, el escape y el deseo de vivir intensamente', 1),
('Zombie', 'The Cranberries', 'una protesta contra la violencia y la guerra, especialmente el conflicto en Irlanda del Norte', 1),
('Wonder', 'Shawn Mendes', 'canción introspectiva sobre las expectativas, la vulnerabilidad y el deseo de ser comprendido', 1),
('Take on Me', 'A-ha', 'canción de amor que mezcla romanticismo con una energía vivaz y nostálgica', 1),
('All of Me', 'John Legend', 'una balada romántica dedicada al amor incondicional y la aceptación total de la pareja', 1),
('Viva La Vida', 'Coldplay', 'canción sobre el arrepentimiento, la reflexión y la pérdida de poder', 1),
('My Heart Will Go On', 'Celine Dion', 'canción sobre el amor eterno y la esperanza más allá de la pérdida', 1),
('Fix You', 'Coldplay', 'una balada sobre la compasión y el apoyo hacia alguien que está sufriendo', 1),
('Lose Yourself', 'Eminem', 'canción motivacional que habla de aprovechar las oportunidades y superar los desafíos', 1),
('Every Breath You Take', 'The Police', 'una canción de amor obsesivo que refleja el control y la vigilancia en una relación', 1),
('Don\'t Stop Believin\'', 'Journey', 'un himno sobre la esperanza y la perseverancia ante la adversidad', 1),
('No Woman, No Cry', 'Bob Marley', 'canción que ofrece consuelo y esperanza, animando a seguir adelante pese a las dificultades', 1),
('Enter Sandman', 'Metallica', 'Que viene el hombre del saco', 1),
('One', 'Metallica', 'Canción en contra de la guerra', 1),
('fasdf', 'fas', 'fas', 1),
('Master of puppets', 'Metallica', 'crítica al control y la manipulación, especialmente en relación con la adicción a las drogas', 1);
