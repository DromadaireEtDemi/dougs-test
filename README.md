# Dougs Test Technique

Félicitations, tu as passé la première étape d’entretiens avec succès !

L’équipe Prod & System de Dougs souhaite te soumettre un petit challenge pour
apprendre à te connaître.

Rien de trop compliqué, cela ne devrait te prendre que quelques heures.

N'hésite pas à nous contacter si tu as besoin de clarifications.

Contact: [test-technique@dougs.fr](mailto:test-technique@dougs.fr)

## Table des Matières

- [Introduction](#introduction)
- [Contexte](#contexte)
- [Développement](#développement)
  - [Spec Technique](#spec-technique)
    - [Structure De Donnée](#structure-de-donnée)
    - [Api](#api)
- [Containerisation Et Orchestration](#containerisation-et-orchestration)
  - [Containerisation](#containerisation)
  - [Cluster Kubernetes](#cluster-kubernetes)
- [Infra As Code](#infra-as-code)
  - [Présentation Du Contexte](#présentation-du-contexte)
  - [Problématique](#problématique)
- [Livrable Attendu](#livrable-attendu)
- [Critère d'évaluation](#critère-dévaluation)

## Introduction

Le sujet est composé de trois parties représentant, de manière simplifié, ce
que notre équipe est améné à faire, c'est à dire :

- [Developpement](#développement)
- [Containerisation et Orchestration](#containerisation-et-orchestration)
- [Infra as Code](#infra-as-code)

Normalement, ces trois parites sont indépendantes et s'organisent autour du
[contexte](#contexte) décrit ci-dessous.

## Contexte

En tant que cabinet d’expertise-comptable, Dougs a besoin de récupérer les
opérations bancaires de ses client·e·s. Cette synchronisation bancaire est gérée
par des prestataires externes.

Ces prestataires font du scrapping pour récupérer les transactions depuis le
site des banques. Cette technique n’est pas infaillible, et il arrive parfois
que certaines opérations soient remontées en double ou qu’il en manque
quelques-unes.

Il est primordial de nous assurer de l’intégrité de cette synchronisation, sans
quoi la comptabilité de nos client·e·s pourrait être faussée.

## Développement

Nous demandons au client·e de nous fournir les relevés bancaires de sa banque
pour chaque mois.

Nous pouvons ainsi avoir des points de contrôle tout au long de l’année grâce au
solde indiqué en fin de période de chaque relevé.

**Le solde indiqué sur un relevé bancaire est juste**.

En cas d’anomalie, un·e comptable effectue un contrôle et supprime le doublon ou
crée manuellement les opérations manquantes.

### Objectif

Étant donné une liste d’opérations bancaires, ainsi que des points de contrôle,
il faut définir un algorithme qui permette de :

- Valider ou invalider l’intégrité de la synchronisation
- Le cas échéant, simplifier au maximum le contrôle manuel du comptable.

#### Lancement de l'Application

L'application peut dors-et-déjà être lancée telle quelle avec les commandes
suivantes :

```bash
# En utilisant npm
npm run start:dev
# Ou
npm run start:prod

# Ou en utilisant le Makefile
make run-debug
# Ou
make run-prod
```

Ce qui peut te permettre de commencer par la partie
[Containerisation Et Orchestration](#containerisation-et-orchestration)

#### Lancement des Tests

Une petite suite de test initial est déjà configurée (fichier `*.spec.ts` ou
`*.e2e.spec.ts`).

Elle peut être lancée avec les commandes suivantes :

```bash
# En utilisant npm
npm run test
# Ou pour avoir le coverage
npm run test:cov

# Ou en utilisant le Makefile
make test
# Ou pour avoir le coverage
make test-cov
```

### Spec Technique

#### Structure de données

Structure des opérations bancaires (`movements`):

```typescript
{
    id: number,
    date: Date,
    wording: string,
    amount: number
}
```

Structure des points de contrôle (`balances`):

```typescript
{
    date: Date,
    balance: number
}
```

#### API

API attendue:

```req
POST /movements/validation
```

Example de structure des données en entrée:

```jsonc
{
  "movements": [
    {
      "id": 1,
      "date": "2023-11-05T13:43:51.604Z",
      "label": "test",
      "amount": 0
    }
  ],
  "balances": [
    {
      "date": "2023-11-05T13:43:51.604Z",
      "balance": 0
    }
  ]
}
```

Réponses attendues :

- Code `2XX`:

```json
{
  "message": "Accepted"
}
```

- Code `4XX`:

```json
{
    "message": "xxx xx xx xxxx",
    "reasons": [
        { [...] }
    ]
}
```

A toi de définir l’interface des `reasons` avec tous les détails que tu juges
nécessaire.

Cette spec n’est là qu'à but indicatif, tu es libre de la compléter afin de
répondre au mieux au problème et nous faire part de ta proposition.

## Containerisation et Orchestration

La seconde partie de ce test va constituer à containeriser et deployer
l'application. Pour cela, il te faudra :

- Containeriser l'application avec la technologie de ton choix (LXC, Docker,
  etc.)
- Déployer ton application dans un cluster k8s avec la technologie de ton choix
  (manifeste kubernetes, kustomize, helm, tanka, etc.)

L'objectif est de pouvoir interroger la route API
`http://localhost:<PORT>/movements/validation` telle que la resolution pointe
vers le service déployé dans le cluster.

### Containerisation

Pour la containerisation, tu es libre d'utiliser l'outil que tu souhaites,
l'objectif est d'obtenir un container OCI (Open Container Initiative) que l'on
peut déployer dans un cluster kubernetes.

### Cluster Kubernetes

Pour cette partie, il va te falloir un cluster kubernetes et un registre local.

Pour cela, nous te proposons d'installer [kind](https://kind.sigs.k8s.io/)
(Kubernetes in Docker) et un container runtime parmis :

- [docker](https://www.docker.com/)
- [podman](https://podman.io/)
- [nerdctl](https://github.com/containerd/nerdctl)

Une fois installé, nous t'avons préparé un Makefile pour automatiquement lancer
un cluster kubernetes avec la commande suivante :

```bash
make deploy-cluster
```

Cela va déployer un cluster `test-dougs` avec un `ingress nginx` et registre
interne et ainsi de build ton image localement pour ensuite l'envoyer dans le
registre du cluster avec la commande suivante :

```bash
kind load --name "test-dougs" docker-image <NOM_DE_TON_IMAGE>:latest
```

Te permettant ainsi de déployer ton image dans le cluster.

Une fois terminé, tu pourras detruire le cluster avec la commande suivante:

```bash
make delete-cluster
```

**REMARQUE**: Tu as aussi la liberté d'utiliser d'autre outils pour simuler le
registre (comme hardbor ou un registre local) et le cluster kubernetes pour tes
tests de déploiement (comme minikube ou k3s).

L'objectif de cette partie sera pour toi de rédiger (ou générer) des manifestes
kubernetes que l'on peut déployer dans le cluster (par exemple via `kube apply
-f` ou `helm install test-dougs .`).

**NOTE**: Petit plus si l'application déployée n'est accessible que depuis
**http://localhost**.

## Infra as Code

Cette dernière partie se concentrera sur le dossier `terraform/` à la racine de
ce repertoire.

Comme nous n'allons pas te demander déployer des ressources sur tes deniers
personnels, il s'agira d'une question d'analyse de code.

### Présentation du contexte

Dans le dossier `terraform`, tu trouveras le déploiement d'une Zone DNS et de
plusieurs Records Sets fait de deux manières différentes dans le fichier
`terraform/main.tf`.

Ce déploiement fait appel au module DNS qui se trouve dans le sous dossier
`terraform/modules/dns`.

Ce module est censé nous permettre de déployer une Zone DNS et des Records Set
dans cette zone DNS. Mais il peut aussi nous permettre de ne déployer que des
Records Set dans une Zone DNS déjà existante.

### Problématique

Le module DNS `terraform/modules/dns` présente quelques soucis de conception et
d'implémentation qui font que le `terraform plan` (ou `tofu plan`) puis le
`terraform apply` (ou `tofu apply`) de notre Zone DNS et de ses records sets ne
fonctionne pas.

Tes objectifs sont donc les suivants :

- Identifier et expliquer les soucis de conception
- Proposer une correction pour corriger ces problèmes

Cet exercice peut s'apparenter a une review sur une Pull Request (ou Merge
Request) avec la différence que la correction est apporté par la personne qui
fait la review, c'est à dire toi.

## Livrable Attendu

- Implémentation de l'algorithme permettant de:
  - Valider ou invalider l’intégrité de la synchronisation
  - Le cas échéant, simplifier au maximum le contrôle manuel du comptable.
  - Définir l’interface des `reasons` avec tous les détails que tu juges
    nécessaire.
- Fichier(s) de containerisation de l'application
- Fichier(s) de déployement de l'application dans un contexte kubernetes
- Retour d'analyse et correction du module terraform
- Une petite analye de ta production et du test en lui même

Le tout nous seras transmis via un lien Github en donnant accès à ce repo.
Nous te transmettrons les ID Github pour le partage du repo.

## Critère d'évaluation

- Developpement
  - Structure du code de l'application
  - Complexité de l'algorithme
  - Présence et pertinence des tests
- Containerisation
  - Structure (i.e. layers si Dockerfile par exemple) de l'image
  - Contenu et taille de l'image
- Deploiement Kubernetes
  - Contenu des manifestes (rédigés ou générés par exemple via Helm)
  - Configuration du déploiement (ressources, service, ingress, networkpolicy, etc.)
- Terraform/OpenTofu
  - Detection des soucis et explication
  - Pertinence de la solution proposée
- Qualité de l'analyse personnelle

Nous reviendrons rapidement vers toi pour débriefer.
Bon courage, à bientôt.
