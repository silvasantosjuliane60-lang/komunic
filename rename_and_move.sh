#!/bin/bash
cd "/home/julianemariasilvaesantos/Documentos/komunic alfa"

declare -A files
files=(
  ["'' O SOM DA LETRA I''.ogg"]="I.ogg"
  ["''O SOM DA LETRA A''.ogg"]="A.ogg"
  ["''O SOM DA LETRA D.''ogg"]="D.ogg"
  ["''O SOM DA LETRA E''.ogg"]="E.ogg"
  ["''O SOM DA LETRA F''.ogg"]="F.ogg"
  ["''O SOM DA LETRA O''.ogg"]="O.ogg"
  ["''O SOM DA LETRA U''.ogg"]="U.ogg"
  ["O SOM DA LETRA B.ogg"]="B.ogg"
  ["O SOM DA LETRA C.ogg"]="C.ogg"
  ["O SOM DA LETRA G.ogg"]="G.ogg"
  ["O SOM DA LETRA J.ogg"]="J.ogg"
  ["O SOM DA LETRA K.ogg"]="K.ogg"
  ["O SOM DA LETRA L.ogg"]="L.ogg"
  ["O SOM DA LETRA M.ogg"]="M.ogg"
  ["O SOM DA LETRA N.ogg"]="N.ogg"
  ["O SOM DA LETRA P.ogg"]="P.ogg"
  ["O SOM DA LETRA Q.ogg"]="Q.ogg"
  ["O SOM DA LETRA R.ogg"]="R.ogg"
  ["O SOM DA LETRA S.ogg"]="S.ogg"
  ["O SOM DA LETRA T.ogg"]="T.ogg"
  ["O SOM DA LETRA V.ogg"]="V.ogg"
  ["O SOM DA LETRA W.ogg"]="W.ogg"
  ["O SOM DO X.ogg"]="X.ogg"
  ["O SOM DO Y.ogg"]="Y.ogg"
  ["O SOM DO Z.ogg"]="Z.ogg"
)

DEST="jogo_web/www/assets/audio/fonetico"

for old_name in "${!files[@]}"; do
  new_name="${files[$old_name]}"
  if [ -f "$old_name" ]; then
    echo "Moving '$old_name' to '$DEST/$new_name'"
    mv "$old_name" "$DEST/$new_name"
  fi
done

# Let's also check if H is missing. Is there H? H doesn't have a sound usually.
