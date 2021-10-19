<?php

return [
    'class' => 'yii\db\Connection',
    'dsn' => 'pgsql:host=postgres;dbname=moscow-depersonalization-data',
    'username' => 'dmitrii',
    'password' => 'dev',
    'charset' => 'utf8',
    'on afterOpen' => fn($event) => $event->sender->createCommand("set datestyle = 'German,DMY'")->execute(),

    // Schema cache options (for production environment)
    //'enableSchemaCache' => true,
    //'schemaCacheDuration' => 60,
    //'schemaCache' => 'cache',
];
