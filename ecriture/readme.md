# Jour 4

## Projet perso

L'objectif ce mon projet est de mettre en page de manière dynamique et grace a un algorithme un texte donné, le tout en P5.js.
J'ai choisi de mettre en page le tete de la bible, sur une image d'ange que j'ai au préalable traité pour la mettre en noir et blanc, pour faciliter par la suite le masquage. 
Le texte défile et ne s'affiche que sur les pixels blancs, créant donc une sorte de "rivière" de lettres. Chaque ligne est composée de phrases prises au hasard dans la bible, dans le fixhier bible.txt
Il est tout a fait possible de changer l'image ou le texte, il suffit de changer les soucres dans le code. A noter que l'image soit être en noir et blanc, sous risque de bugs étant donné que je n'ai pas prévu d'autre cas.
J'ai également testé de le faire avec la webcam, le processus est très similaire, appart le fait qu'il faille cette fois-ci calculer la luminance en input de l'image pour bien traiter l'image.
Une piste d'amélioration serait de rajouter du text to speech, ce que j'ai réussi a a faire mais pas comme je voulais, j'ai donc laissé sans.