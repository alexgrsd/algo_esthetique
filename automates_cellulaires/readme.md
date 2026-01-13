# AUtomate cellulaire

# Projet en groupe

Pour la partie projet libre, nous avons choisi de faire un système de création d'un automate basé sur la musique. Celui-ci est réalisé en java, avec la librairie sound de processing, ainsi que la librairie soundCipher trouvable ici : [text](https://explodingart.com/soundcipher/download.html) 
Le programme est divisé en deux parties : 
- La partie création de musique et logique qui a été gérée par les 3 autres membres du groupe. Celle-ci prend un automate de 12 cellules en ligne, et de crée un arrangement de notes au piano suivant une logique d'automate.
- La seconde partie est la partie UI que j'ai réalisé. Elle se compose d'une interface simple composée d'une part de boutons pour créer la mélodie de base et lancer la simulation, ainsi qu'un jeu de la vie stylisé. Celui-ci tourne en continu grace a l'ajout de noise qui active des cases aléatoirement dans le jeu. Il réagit également aux notes jouées, ajoutat des lignes de cellules.