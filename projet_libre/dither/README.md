# Jour 5

## Projet libre

Pour ce projet, j'ai voulu continuer le projet du jour 4, en créant une mini application permettant de :
- dither des photos 
- leur donner le même effet de cascade de texte que précédément

L'utilisateur n'a qu'a importer une photo, et en option un texte, et peut la dither (ici je n'ai implémenté que 4 algorithmes pour une question de temps) et peut ensuite appliquer le même effet de "pluie de texte" 
L'inspiration vient essentielement du programme "dither boy" qui a le même but, tout en rajoutant cet effet de texte animé pour rajouter. une touche personnelle. 

NB : Pour l'implémentation, j'ai eu de l'aide de l'IA pour m'aider a faire l'UI et implémenter la pipeline dithering -> textrain.

Pistes d'améliorations : 

- recoder l'applications entièrement (moi même) dans un langage plus performant, surement en cpp
- rajouter plus d'effets de post processing,les scan lines et le décalage RGB étaient simples mais assez basique
- rajouter plus d'effets de dither et pouvoir plus customiser les rendus 
- rajouter plus de formats supportés et permettre d'exporter en gif / vidéo
