# Projet 7 - Créer un réseau social d’entreprise, Groupomania.

## Instruction mySQL :

*Connectez vous au serveur mySQL de votre choix. `mysql -u 'user' -p`  
*Si vous utiliser un autre utilisateur que root veuillez vous administrer les droits sur la base de donnée de votre choix. `GRANT ALL PRIVILEGES ON madatabase.\* to 'user'@'localhost'`  
*Créez une base de donnée MYSQL avec le nom utilisé à l'étape d'avant. `CREATE DATABASE madatabase`  

## Instruction backend :

*Ouvrez le dossier __backend__ puis __config__.  
*Dans développement, veuillez remplacer `USER`, `PASSWORD` et `MADATABASE` par votre user, password et nom de database que vous avez choisi dans mySQL.  
*Dans le dossier __backend__ ouvrez le terminal.  
*Effectuez un `npm install` pour installer les modules.  
*Lancez le serveur avec `node server`.

## Instruction frontend :

*Ouvrez le dossier __frontend__ puis __groupomania__.  
*Lancez le terminal dans ce dossier.  
*Effectuez un `npm install` pour installer les modules.  
*Lancez le frontend avec `npm run serve`.  
*Le site devrait être à cette adresse: [http://localhost:8080/].  

## Information supplémentaire frontend :

*À l'inscription le mot de pass doit contenir au moins __8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et un caractère spécial__, le pseudo ne peut être que __alpha-numérique__, l'email doit être au format __xxxxx@xxxxx.xxx__, le nom et prénom ne peut contenir que des __lettres__.  
*Le formulaire d'envoi de post est soumis à un validateur qui autorise que __les lettres, chiffres et caractères spéciaux utilisés dans un texte__.  


## Information supplémentaire backend :
*Utilisation d'__Helmet__ pour sécuriser les headers de l'application express.  
*Utilisation de __cryptoJS__ pour __encrypter__ les données sensible de la base de données.  
*Utilisation de __Bcrypt__ pour __Hash__ le mot de pass.  
*Utilisation de __jsonwebtoken__ pour l'__authentification__.  
*Utilisation de __rate limiter__ pour limiter le login à __10__ requètes par __IP__ par __heure__.  
*Utilisation de __speed limiter__ pour ralentir les tentatives de connections après __5__ essais.  
*Utilisation de __dotenv__ pour cacher les données sensibles dans le code.  
*Utilisation de __maskData__ pour cacher les informations personnel envoyé à l'utilisateur.  
