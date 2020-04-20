const messages = {
    fr: {
        projectTitle: 'Projet MODSIR19',
        pageNotFound: 'Page non trouvée',
        returnToHomepage: 'Retourner à la page principale',
        cancel: 'Annuler',
        save: 'Enregistrer',
        download: 'Télécharger',
        appBar: {
            about: 'A propos de',
            developpedBy: 'Application développée par',
            version: 'Version',
            questionsOrRemarks: 'Questions ou remarques :',
            wip: 'En cours de développement',
            help: 'Aide',
            login: 'Se connecter',
            logout: 'Se déconnecter',
            mainMenu: 'Menu',
        },
        home: {
            simpleSIR: 'Modèle SIR simple',
            complexSIR: 'Modèle SIR complexe',
            sirPlusH: 'Modèle SIR+H',
            visualisation_example_desc: 'Exemple de visualisation du modèle',
            model_diagram: 'Explication du diagrame',
            start_button: 'Continuer',
        },
        error: {
            shouldBeNumber: 'Doit être un nombre',
            positiveNumber: 'Doit être un nombre positif',
            tooSmall: 'Cela parait petit',
            tooLarge: "N'est pas un peu grand ?",
            required: 'Obligatoire',
        },
        form: {
            population: 'Population',
            patient0: 'Patients infectés à J0',
            r0: 'R0',
            s0: 'S0',
            lambda: 'Paramètre lambda',
            beta: 'beta',
            compute: 'Calculer',
            kpe: 'Kpe',
            krd: 'Krd',
            taux_tgs: 'TGS',
            taux_thr: 'THR',
            tem: 'Tem',
            tmg: 'Tmg',
            tmh: 'Tmh',
            thg: 'Thg',
            thr: 'Thr',
            trsr: 'Trsr',
            lim_time: 'Nombre de jours',
            j_0: 'Début de la simulation',
            r: 'r',
            dm_incub: 'dm_incub',
            dm_r: 'dm_r',
            dm_h: 'dm_h',
            dm_sm: 'dm_sm',
            dm_si: 'dm_si',
            dm_ss: 'dm_ss',
            pc_ir: 'pc_ir',
            pc_ih: 'pc_ih',
            pc_sm: 'pc_sm',
            pc_si: 'pc_si',
            pc_sm_si: 'pc_sm_si',
            pc_sm_out: 'pc_sm_out',
            pc_si_dc: 'pc_si_dc',
            pc_si_out: 'pc_si_out',
            pc_h_ss: 'pc_h_ss',
            pc_h_r: 'pc_h_r',
            afterDate: 'À partir de',
            addRule: 'Ajouter',
            deleteRule: 'Supprimer',
            rules: 'Règles',
            tip: {
                population: 'Effectif de la population',
                patient0: 'Nombre de patients intialement infectés',
                s0: "Proportion initiale d'individus sains",
                lambda: 'Temps moyen avant guérison',
                beta: "Taux d'infection en individus par unité de temps",
                r0: 'Taux de contagiosité standard',
                taux_tgs: 'Taux de guérison spontannée',
                taux_thr: "Taux de patients très graves d'emblée",
                kpe: 'Taux de population exposée',
                krd: 'Taux de décès en réanimation',
                tem: 'Temps Exposé - Malade',
                tmg: 'Temps Malade - Guéri',
                tmh: 'Temps Malade - Hospitalisé',
                thg: 'Temps Hospitalisé - Guéri',
                thr: 'Temps Hospitalisé - Réanimation',
                trsr: 'Temps Réanimation - Sortie de Réanimation',
                lim_time: 'Nombre de jours simulés',
                r: 'Proportion de contacts effectifs',
                dm_incub: "Durée d'incubation",
                dm_r: 'Durée moyenne de rétablissement',
                dm_h: 'Durée moyenne d’apparition de signes graves',
                dm_sm: 'Durée moyenne de séjour en Médecine',
                dm_si: 'Durée moyenne de séjour en Soins Intensif',
                dm_ss: 'Durée moyenne de séjour en Soins de Suite',
                pc_ir: 'Pourcentage de la population infectée qui va guérir spontanément',
                pc_ih:
                    'Pourcentage de la population infectée qui va justifier d’une hospitalisation',
                pc_sm: 'Pourcentage de patients hospitalisés en Médecine',
                pc_si: 'Pourcentage de patients hospitalisés en Soins Intensifs',
                pc_sm_si: 'Pourcentage de patients qui passent de Médecine en Soins Intensifs',
                pc_sm_out: 'Pourcentage de patients qui passent de Médecine à la sortie',
                pc_si_dc: 'Pourcentage de patients qui passent de Soins Intensifs au décés',
                pc_si_out: 'Pourcentage de patients qui passent de Soins Intensifs à la sortie',
                pc_h_ss: "Pourcentage de patients quittant l'hôpital pour les Soins de Suite",
                pc_h_r: "Pourcentage de patients quittant l'hôpital pour Rétablissement",
                afterDate: 'À partir de',
                addRule: 'Ajouter une règle',
                deleteRule: 'Supprimer une règle',
                rules: 'Règles',
            },
        },
        panel_title: {
            disease_sliders: 'Paramètres liés à la maladie',
            hospital_management_sliders: 'Paramètres liés à la gestion hospitalière',
            general_rules_sliders: 'Paramètres généraux',
            quarantine_sliders: 'Paramètres de confinement',
        },
        chart: {
            title: 'Modèle SIR+H',
            y_scale_label: 'Nombre de personnes',
            x_scale_label: 'Temps',
            exposed: 'exposés',
            incub: 'incubation',
            infected: 'infectés',
            recovered: 'guéris',
            hospitalized: 'hospitalisés',
            normal_care: 'soins medicaux',
            following_hospitalized: 'soins de suite',
            intensive_care: 'soins intensifs',
            exit_intensive_care: 'sortie soins intensifs',
            dead: 'décédés',
        },
    },
};

export default messages;