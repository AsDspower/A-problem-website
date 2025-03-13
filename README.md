# vue-f

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### MYSQL created
```
create table if not exists problem.download_url
(
    id   varchar(255) not null
        primary key,
    url  varchar(255) not null,
    name varchar(255) not null
);

create table if not exists problem.historyproblem
(
    id        varchar(255) not null
        primary key,
    problemid varchar(255) not null,
    userid    varchar(255) not null
);

create table if not exists problem.problemdata
(
    id       varchar(255) not null
        primary key,
    title    varchar(255) not null,
    content  text         not null,
    solution text         not null
);

create table if not exists problem.user
(
    userId       varchar(255) not null
        primary key,
    userName     varchar(255) not null,
    userPassWord varchar(255) not null
);


```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
