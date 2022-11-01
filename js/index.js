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
  const test = await getPosDepartEtArrivee([52, 201, 20]);
  console.log(test);

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

async function connexe(){
  const requete = await fetch(`https://oussama.teroaz.me/connexe`);
    // traduction du json en javascript
    const resultat = await requete.text();
  alert(resultat);
}

async function handleClick() {
  const elementCharge = document.getElementById("chargement");
  elementCharge.innerText = "CHARGEMENT...";
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

  console.log(
    `Requete envoyée : Départ : ${optionDepart}, Arrivée : ${optionArrivee}`
  );

  //paragraphe d'affichage du résultat
  const elementResultat = document.getElementById("resultat");
  elementResultat.innerText = "";
  //si rien n'est choisi
  if (elementArrivee.selectedIndex === 0 || elementDepart.selectedIndex === 0) {
    elementCharge.innerText = " ";
    elementResultat.innerText =
      "Veuillez choisir une station de départ et une station d'arrivée.";
  } else if (optionDepart === optionArrivee) {
    //si on a choisi 2 stations identiques
    elementCharge.innerText = " ";
    elementResultat.innerText = "Veuillez choisir 2 stations différentes.";
  } else {
    // sinon on lance la requete
    //requete (tu mettras le lien à la place du "/" dans le fetch en mettant les id comme tu veux)
    const requete = await fetch(`https://oussama.teroaz.me/try/${optionDepart}/${optionArrivee}`);
    // traduction du json en javascript
    const resultat = await requete.json();
    elementCharge.innerText = " ";
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
                " h " +
                Math.floor(duree / 60) +
                " m et " +
                (duree % 60) +
                " s"
            )
          );
        else str1.then((val) => ajouterText("-"+val.split("(")[0]));
      }
    });
  }
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

async function getSum() {

  const elementCharge = document.getElementById("chargement");
  elementCharge.innerText = "CHARGEMENT ACPM...";

  const requete = await fetch("https://oussama.teroaz.me/acpm");
  const data = await requete.json();
  let sum = 0;
  data.map((value) => (sum += value[2]));
  await dessiner();
}

async function dessiner() {
  const stations = await fetch("https://oussama.teroaz.me/acpm");
  const data = await stations.json();
  const element = document.getElementById("stations");
  data.map(async (array) => {
    const { depart, arrivee } = await getPosDepartEtArrivee(array);
    const circleDepart = document.createElementNS("http://www.w3.org/2000/svg","circle");
    const line = document.createElementNS("http://www.w3.org/2000/svg","line");
    const circleArrivee = document.createElementNS("http://www.w3.org/2000/svg","circle");
    circleDepart.style = "stroke: black; stroke-width: 3px;";
    circleDepart.setAttributeNS(null,"cx", depart.x);
    circleDepart.setAttributeNS(null,"cy", depart.y);
    circleDepart.setAttributeNS(null,"r", 3);
    circleArrivee.style = "stroke: black; stroke-width: 3px;";
    circleArrivee.setAttributeNS(null,"cx", arrivee.x);
    circleArrivee.setAttributeNS(null,"cy", arrivee.y);
    circleArrivee.setAttributeNS(null,"r", 3);
    line.setAttributeNS(null,"x1", depart.x);
    line.setAttributeNS(null,"x2", arrivee.x);
    line.setAttributeNS(null,"y1", depart.y);
    line.setAttributeNS(null,"y2", arrivee.y);
    line.setAttributeNS(null,"stroke", "black");
    line.setAttributeNS(null,"stroke-width", "3px");
    const elementCharge = document.getElementById("chargement");
    elementCharge.innerText = " ";
    element.append(circleDepart);
    element.append(line);
    element.append(circleArrivee);
  });
}

async function getPosDepartEtArrivee(array) {
  const { idDepart, idArrivee } = { idDepart: array[0], idArrivee: array[1] };
  const { nameDepart, nameArrivee } = {
    nameDepart: await findName(idDepart),
    nameArrivee: await findName(idArrivee),
  };
  const pospoints = await findPos();
  const filteredPosDepart = pospoints.filter((pospoint) => {
    const tab = pospoint.split(";");
    return tab[2] === nameDepart;
  });
  const filteredPosArrivee = pospoints.filter((pospoint) => {
    const tab = pospoint.split(";");
    return tab[2] === nameArrivee;
  });
  return {
    depart: {
      x: filteredPosDepart[filteredPosDepart.length - 1].split(";")[0],
      y: filteredPosDepart[filteredPosDepart.length - 1].split(";")[1],
    },
    arrivee: {
      x: filteredPosArrivee[filteredPosArrivee.length - 1].split(";")[0],
      y: filteredPosArrivee[filteredPosArrivee.length - 1].split(";")[1],
    },
  };
}

async function findName(stationId) {
  const stationsTab = await getStations();
  const ligne = stationsTab.filter((stat) => {
    const stationTab = stat.split(";");
    const id = parseInt(stationTab[0].substring(2, 6)); //id de la ligne
    return stationId === id;
  });
  const strLigne = ligne[0].split(";");
  return `${strLigne[0].substring(7, strLigne[0].length).trim()}`;
}

async function findPos() {
  const requete = await fetch("pospoints.txt");
  const texte = await requete.text();
  const stations = texte.split("\r\n"); // chaque ligne

  return stations.map((ligne) => {
    const resultat = ligne.split(";");
    const posX = resultat[0];
    const posY = resultat[1];
    const nomStation = resultat[2].replace(/@/g, " ");
    return `${posX};${posY};${nomStation}`;
  });
}

