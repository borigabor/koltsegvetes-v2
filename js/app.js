
const feluletVezerlo = (function() {

    const DOMelemek = {
        inputTipus: ".hozzaad__tipus",
        inputLeiras: ".hozzaad__leiras",
        inputErtek: ".hozzaad__ertek",
        inputGomb: ".hozzaad__gomb",
        bevetelTarolo: ".bevetelek__lista",
        kiadasTarolo: ".kiadasok__lista",
        koltsegvetesCimke: ".koltsegvetes__ertek",
        osszBevetelCimke: ".koltsegvetes__bevetelek--ertek",
        osszKiadasCimke: ".koltsegvetes__kiadasok--ertek",
        szazalekCimke: ".koltsegvetes__kiadasok--szazalek",
        kontener: ".kontener",
        szazalekokCimke: ".tetel__szazalek",
        datumCimke: ".koltsegvetes__cim--honap"
    }

    return {
        getInput: function() {
            return {
                tipus: document.querySelector(DOMelemek.inputTipus).value,
                leiras: document.querySelector(DOMelemek.inputLeiras).value,
                ertek: parseInt(document.querySelector(DOMelemek.inputErtek).value)
            }
        },

        getDOMelemek: function() {
            return DOMelemek;
        },

        tetelMegjelenites: function(obj, tipus) {

            let html, ujHtml, elem;

            if(tipus === "bev") {

                elem = DOMelemek.bevetelTarolo;

                html = '<div class="tetel" id="bev-%id%"><div class="tetel__leiras">%leiras%</div><div class="right"><div class="tetel__ertek">%ertek%</div><div class="tetel__torol"><button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if(tipus === "kia") {

                elem = DOMelemek.kiadasTarolo;

                html = '<div class="tetel" id="kia-%id%"><div class="tetel__leiras">%leiras%</div><div class="right"><div class="tetel__ertek">%ertek%</div><div class="tetel__szazalek">21%</div><div class="tetel__torol"><button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button></div></div>';

            }

            ujHtml = html.replace("%id%", obj.id);
            ujHtml = ujHtml.replace("%leiras%", obj.leiras);
            ujHtml = ujHtml.replace("%ertek%", obj.ertek);

            document.querySelector(elem).insertAdjacentHTML("beforeend", ujHtml);

        },

        urlapTorles: function() {

            let mezok, mezokTomb;

            mezok = document.querySelectorAll(DOMelemek.inputLeiras + ',' + DOMelemek.inputErtek);

            mezokTomb = Array.from(mezok);

            mezokTomb.forEach( aktualisElem => {
                aktualisElem.value = "";
            })

            mezokTomb[0].focus();

        },

        koltsegvetesMegjelenites: function(obj) {

            document.querySelector(DOMelemek.koltsegvetesCimke).textContent = obj.koltsegvetes;
            document.querySelector(DOMelemek.osszBevetelCimke).textContent = obj.osszBevetel;
            document.querySelector(DOMelemek.osszKiadasCimke).textContent = obj.osszKiadas;
            
            if(obj.osszBevetel > obj.osszKiadas) {
                document.querySelector(DOMelemek.szazalekCimke).textContent = `${obj.szazalek}%`;
            } else {
                document.querySelector(DOMelemek.szazalekCimke).textContent = '---';
            }
        },

        tetelTorles: function(tetelID) {
             const elem = document.getElementById(tetelID)

             elem.parentNode.removeChild(elem);

        },

        szazalekokMegjelenitese: function(szazalekok) {
            
            let elem, szazalekTomb;

            elem = document.querySelectorAll(DOMelemek.szazalekokCimke);

            szazalekTomb = Array.from(elem);

            szazalekTomb.forEach((aktualisElem, index) => {
                if(szazalekok[index] > 0) {
                    aktualisElem.textContent = szazalekok[index] + "%";
                }else {
                    aktualisElem.textContent = `---`;
                }
            })
        },

        datumMegjeleites: function() {
            let most, ev, honapok, honap;

            honapok = ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'];

            most = new Date();
            ev = most.getFullYear();
            honap = most.getMonth();

            document.querySelector(DOMelemek.datumCimke).textContent = `${ev} - ${honapok[honap]}`;
        }
    }



})();






const koltsegvetesVezerlo = (function() {

    const Bevetelek = function(id, leiras, ertek) {
        this.id = id;
        this.leiras = leiras;
        this.ertek = ertek;
    }

    const Kiadasok = function(id, leiras, ertek) {
        this.id = id;
        this.leiras = leiras;
        this.ertek = ertek;
        this.szazalek = -1;
    }

    Kiadasok.prototype.szazalekSzamitas = function(osszBevetel) {
        if(osszBevetel > 0) {
            this.szazalek = Math.round((this.ertek / osszBevetel) * 100);
        } else {
            this.szazalek = -1;
        }
    }

    Kiadasok.prototype.getSzazalek = function() {
        return this.szazalek;
    }

    const vegosszegSzamolas = function(tipus) {
        let osszeg = 0;

        adat.tetelek[tipus].forEach(aktualisElem => {
            osszeg += aktualisElem.ertek;
        })

         adat.osszegek[tipus] = osszeg;
    }

    const adat = {

        tetelek: {
            bev: [],
            kia: []
        },

        osszegek: {
            bev: 0,
            kia: 0
        },

        koltsegvetes: 0,
        szazalek: -1

    }

    return {

        tetelHozzaad: function(tipus, leiras, ertek) {
            let ID, ujTetel;
            ID = 0;

            if(adat.tetelek[tipus].length > 0) {
                ID = adat.tetelek[tipus][adat.tetelek[tipus].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            if(tipus === "bev") {
                ujTetel = new Bevetelek(ID, leiras, ertek);
            } else if(tipus === "kia") {
                ujTetel = new Kiadasok(ID, leiras, ertek);
            }

            adat.tetelek[tipus].push(ujTetel);

            return ujTetel;

        },

        koltsegvetesSzamitas: function() {

            vegosszegSzamolas("bev");
            vegosszegSzamolas("kia");

            adat.koltsegvetes = adat.osszegek.bev - adat.osszegek.kia;

            if(adat.osszegek.bev > 0) {
                adat.szazalek = Math.round((adat.osszegek.kia / adat.osszegek.bev) * 100);
            } else {
                adat.szazalek = -1;
            }

        },

        getKoltsegvetes: function() {
            return {
                koltsegvetes: adat.koltsegvetes,
                osszBevetel: adat.osszegek.bev,
                osszKiadas: adat.osszegek.kia,
                szazalek: adat.szazalek
                
            }
        },
        tetelTorol: function(tipus, id) {

            let idTomb, index;

            idTomb = adat.tetelek[tipus].map((aktualisElem) => {
                return aktualisElem.id;
            })

            index = idTomb.indexOf(id);

            if(index !== -1) {
                adat.tetelek[tipus].splice(index, 1);
            }

        },

        szazalkekokSzamitasa: function() {
            adat.tetelek.kia.forEach(aktualisElem => {
                aktualisElem.szazalekSzamitas(adat.osszegek.bev);
            })
        },

        szazalekLekerdezes: function() {
            const kiadasSzazalekok = adat.tetelek.kia.map(aktualisElem => {
                return aktualisElem.getSzazalek();
            })
            return kiadasSzazalekok;
        },

        teszt: function() {
            console.log(adat);
        }

    }

})();






const vezerlo = (function() {

    const esemenykezeloBeallit = function() {

        const DOM = feluletVezerlo.getDOMelemek();

        document.querySelector(DOM.inputGomb).addEventListener("click",  vezTetelHozzaadas)

        document.addEventListener("keydown", (event) => {
            if(event.key !== undefined && event.key === "Enter") {
                vezTetelHozzaadas();
            } 
            else if(event.keyCode !== undefined && event.keycode === 13) {
                vezTetelHozzaadas();
            }
        })

        document.querySelector(DOM.kontener).addEventListener("click", vezTetelTorles);

    }

    const vezTetelTorles = function(event) {

        let tetelID, splitID, tipus, ID;

        tetelID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(tetelID) {
            splitID = tetelID.split('-');
            tipus = splitID[0];
            ID = parseInt(splitID[1]);
        }

        // 1, tétel törlése az adat objektumbol
        koltsegvetesVezerlo.tetelTorol(tipus, ID);

        // 2, tétel törlése a képernyőröl
        feluletVezerlo.tetelTorles(tetelID);

        // 3, összegek újraszámolása és megjelenítése a képernyőn
        osszegfrissites();

        // 4, százalékok újraszámolása 
        szazalekfrissites();

    }

    const osszegfrissites = function() {
        let koltsegObj;

        // 1, költségvetés frissitése
        koltsegvetesVezerlo.koltsegvetesSzamitas();

        // 2, költségvetés átadása a vezérlőnek
        koltsegObj = koltsegvetesVezerlo.getKoltsegvetes();

        // 3, költségvetés megjelenítése a képernyőn
        feluletVezerlo.koltsegvetesMegjelenites(koltsegObj);

    }

    const szazalekfrissites = function() {
        let szazalek;
        // 1, százalék frissitése
        koltsegvetesVezerlo.szazalkekokSzamitasa();

        // 2, százalék átadása a vezérlőnek
        szazalek = koltsegvetesVezerlo.szazalekLekerdezes();
        // 3, százalékok megjelenítése a képernyőn
        feluletVezerlo.szazalekokMegjelenitese(szazalek);
    }

    const vezTetelHozzaadas = function() {

        let input, ujTetel;

        // 1, bevitt adatok megszerzése
        input = feluletVezerlo.getInput();

        if(input.leiras !== "" && !isNaN(input.ertek) && input.ertek > 0) {
        // 2, adatok átadása a költségvetés vezérlő modulnak
        ujTetel = koltsegvetesVezerlo.tetelHozzaad(
            input.tipus,
            input.leiras,
            input.ertek
        );

        // 3, megjelenítés a képernyőn
        feluletVezerlo.tetelMegjelenites(ujTetel, input.tipus);

        // 4, űrlap törlése
        feluletVezerlo.urlapTorles();

        // 5, költségvetés ujraszámolása és fissitése a felületen
        osszegfrissites();
        }

        // 6, százalékok újraszámolása 
        szazalekfrissites();

    }

    return {

        init: function() {

            feluletVezerlo.koltsegvetesMegjelenites({
                koltsegvetes: 0,
                osszBevetel: 0,
                osszKiadas: 0
            })

            feluletVezerlo.datumMegjeleites();

            esemenykezeloBeallit();
        }

    }

})();

vezerlo.init();