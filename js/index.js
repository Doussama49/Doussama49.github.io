(async () => {
  //récuperation des 2 éléments section du html
  const elementSelectDepart = document.getElementById("depart");
  const elementSelectArrivee = document.getElementById("arrivee");

  //chaque V en dehors du texte explicatif au départ
  const stationsTab = await getStations();

  //fonction map pour traiter toutes les valeurs du tableau (donc toutes les stations)
  stationsTab.map((station) => {
    const stationTab = station.split(";"); 
    const id = stationTab[0].substring(2, 6); //id de la ligne
    const stationName = stationTab[0].substring(7, stationTab[0].length); //nom de la station
    //console.log(stationName);
    //traceAllPoint(stationName);
    const ligne = ` (ligne ${stationTab[1].trim()})`; // numéro de la ligne
    const optionElement = document.createElement("option"); // element à ajouter dans départ
    const optionBis = document.createElement("option"); // element à ajouter dans arrivée
    optionElement.innerText = stationName + ligne; //ajout du texte
    optionBis.innerText = stationName + ligne; //ajout du texte
    optionElement.value = id; //ajout de l'id
    optionBis.value = id; //ajout de l'id
    elementSelectDepart.append(optionBis); // ajout de l'element dans départ
    elementSelectArrivee.append(optionElement); // ajout de l'element dans arrivée
  });
traceAllPoint();
})();

async function getStations() {
  //requete/traitement du texte
  const requete = await fetch("metro.txt");
  const texte = await requete.text();
  const stations = texte.split("\n"); // chaque ligne
  return stations.filter(
    (station) => station.startsWith("V") && station.length < 136
  );
}

async function traceAllPoint(){
const groupeStation = document.getElementById("stations");
const aAjouter = [];

const requete = await fetch("pospoints.txt");
const texte = await requete.text();

const stations = texte.split("\r\n"); // chaque ligne
for (const ligne of stations) {
    const resultat = ligne.split(";");
    const posX = resultat[0];
    const posY = resultat[1];
    const nomStation = resultat[2].replace(/@/g, " ");
    var nom = nomStation;
    aAjouter.push(`<circle style ="fill: white; stroke: black; stroke-width: 2px;" cx="${posX}" cy="${posY}" r="5"></circle>`);
    
}
  groupeStation.innerHTML = aAjouter.join();
}

async function tracePoint(sommet){
  const groupeStation = document.getElementById("stations");
const aAjouter = [];

const requete = await fetch("pospoints.txt");
const texte = await requete.text();

const stations = texte.split("\r\n"); // chaque ligne
for (const ligne of stations) {
    const resultat = ligne.split(";");
    const posX = resultat[0];
    const posY = resultat[1];
    const nomStation = resultat[2].replace(/@/g, " ");

    if (nomStation==sommet){
      aAjouter.push(`<circle cx="${posX}" cy="${posY}" r="2"></circle>`);
    }
}
groupeStation.innerHTML = aAjouter.join();
}

async function connexe(){
  const requete = await fetch(`https://oussama.teroaz.me/connexe`);
    // traduction du json en javascript
    const resultat = await requete.text();
  alert(resultat);
}

async function handleClick() {
  const elementDepart = document.getElementById("depart");
  const elementArrivee = document.getElementById("arrivee");
  //id de la station de départ
  const optionDepart = parseInt(
    elementDepart.options[elementDepart.selectedIndex].value
  );
  //id de la station d'arrivée
  const optionArrivee = parseInt(
    elementArrivee.options[elementArrivee.selectedIndex].value
  );

  //inutile c'était juste pour tester
  console.log(
    `Requete envoyée : Départ : ${optionDepart}, Arrivée : ${optionArrivee}`
  );

  //paragraphe d'affichage du résultat
  const elementResultat = document.getElementById("resultat");
  elementResultat.innerText = "";
  //si rien n'est choisi
  if (elementArrivee.selectedIndex === 0 || elementDepart.selectedIndex === 0) {
    elementResultat.innerText =
      "Veuillez choisir une station de départ et une station d'arrivée.";
  } else if (optionDepart === optionArrivee) {
    //si on a choisi 2 stations identiques
    elementResultat.innerText = "Veuillez choisir 2 stations différentes.";
  } else {
    // sinon on lance la requete
    //requete (tu mettras le lien à la place du "/" dans le fetch en mettant les id comme tu veux)
    const requete = await fetch(`https://oussama.teroaz.me/try/${optionDepart}/${optionArrivee}`);
    // traduction du json en javascript
    const resultat = await requete.json();
    resultat.map(async (val, index) => {
      if (typeof val === "object") {
        const duree = resultat[resultat.length - 1];
        const str1 = findFullString(val[1]);
        const str3 = findFullString(val[3]);
        if (index === 0) str1.then((val) => ajouterText("Départ de : " + val));
        else if (val[0] === val[2])
          str3.then((val) => ajouterText("<br>Changement à : " + val));
        else if (index === resultat.length - 2)
          str3.then((val) =>
            ajouterText(
              "<br>Arrivée à : " +
                val +
                "<br><br> Durée : " +
                Math.floor(duree / 60 / 60) +
                " heures " +
                Math.floor(duree / 60) +
                " minutes et " +
                (duree % 60) +
                " secondes"
            )
          );
        else str1.then((val) => ajouterText("-"+val.split("(")[0]));
      }
    });
    //ça met le texte renvoyé par la requête dans un h4
  }
  //remise à 0 des elements select
  elementArrivee.selectedIndex = 0;
  elementDepart.selectedIndex = 0;
}

async function findFullString(stationId) {
  const stationsTab = await getStations();
  const ligne = stationsTab.filter((stat) => {
    const stationTab = stat.split(";");
    const id = parseInt(stationTab[0].substring(2, 6)); //id de la ligne
    return stationId === id;
  });
  const strLigne = ligne[0].split(";");
  return `${strLigne[0].substring(
    7,
    strLigne[0].length
  )}(ligne ${strLigne[1].trim()})`;
}

function ajouterText(text) {
  const element = document.getElementById("resultat");
  const doTab = !text.includes(":");
  element.innerHTML += doTab ? "&emsp;&emsp;" : "";
  element.innerHTML += text + "<br>";
}



