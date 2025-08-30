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
            ['name' => 'Primary', 'sort_order' => 0],
            ['name' => 'Secondary', 'sort_order' => 1],
            ['name' => 'Alternative', 'sort_order' => 2]
        ],
        'email' => [
            ['name' => 'Primary', 'sort_order' => 0],
            ['name' => 'Secondary', 'sort_order' => 1],
            ['name' => 'Alternative', 'sort_order' => 2]
        ],
        'phone' => [
            ['name' => 'Primary', 'sort_order' => 0],
            ['name' => 'Secondary', 'sort_order' => 1],
            ['name' => 'Alternative', 'sort_order' => 2]
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
