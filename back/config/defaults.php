<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Settings
    |--------------------------------------------------------------------------
    |
    | This file contains default settings for various aspects of the application.
    |
    */

    'communication_types' => [
        'address' => [
            ['name' => 'Primary', 'weight' => 0],
            ['name' => 'Secondary', 'weight' => 1],
            ['name' => 'Alternative', 'weight' => 2]
        ],
        'email' => [
            ['name' => 'Primary', 'weight' => 0],
            ['name' => 'Secondary', 'weight' => 1],
            ['name' => 'Alternative', 'weight' => 2]
        ],
        'phone' => [
            ['name' => 'Primary', 'weight' => 0],
            ['name' => 'Secondary', 'weight' => 1],
            ['name' => 'Alternative', 'weight' => 2]
        ],
    ],

    'talent_boards' => [
        ['name' => 'Direct'],
        ['name' => 'Main'],
        ['name' => 'New Faces'],
    ],

    'talent_body' => [
        'bust' => [
            'min' => 55,
            'max' => 160,
        ],
        'height' => [
            'min' => 70,
            'max' => 210,
        ],
        'hips' => [
            'min' => 55,
            'max' => 170,
        ],
        'waist' => [
            'min' => 45,
            'max' => 150,
        ],
        'weight' => [
            'min' => 15,
            'max' => 180,
        ],
    ],
];
