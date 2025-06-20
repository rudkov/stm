<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

use App\Models\Country;
use App\Models\Team;
use App\Models\Language;
use App\Models\User;
use App\Models\EventType;
use App\Models\TalentCupSize;
use App\Models\TalentDressSize;
use App\Models\TalentEyeColor;
use App\Models\TalentGender;
use App\Models\TalentHairColor;
use App\Models\TalentHairLength;
use App\Models\TalentMaritalStatus;
use App\Models\TalentRelativeType;
use App\Models\TalentShirtSize;
use App\Models\TalentShoeSize;
use App\Models\TalentSkinColor;
use App\Models\TalentSuitCut;
use App\Models\MessengerType;
use App\Models\SocialMediaType;

class FirstTimeSeeder extends Seeder
{
    public function run()
    {
        $this->teams();
        $this->users();

        $this->countries();
        $this->languages();

        $this->eventTypes();
        $this->socialMediaTypes();
        $this->messengerTypes();

        $this->talentHairColors();
        $this->talentHairLengths();
        $this->talentEyeColors();
        $this->talentCupSizes();
        $this->talentShoeSizes();
        $this->talentSkinColors();
        $this->talentMaritalStatuses();
        $this->talentRelativeTypes();
        $this->talentGenders();
        $this->talentShirtSizes();
        $this->talentSuitCuts();
        $this->talentDressSizes();
    }

    public function teams()
    {
        $items = [
            [
                'name' => 'Sothemodels',
            ]
        ];

        foreach ($items as $item) {
            Team::create($item);
        }
    }

    public function users()
    {
        $items = [
            [
                'name' => 'Victor Rudkov',
                'email' => 'victor.rudkov@gmail.com',
                'email_verified_at' => now(),
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                'remember_token' => Str::random(10),
                'team_id' => 1,
            ],
            [
                'name' => 'Roman Larichev',
                'email' => 'roman.f.larichev@gmail.com',
                'email_verified_at' => now(),
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                'remember_token' => Str::random(10),
                'team_id' => 1,
            ],
            [
                'name' => 'Roman Selivanov',
                'email' => '4romka@gmail.com',
                'email_verified_at' => now(),
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                'remember_token' => Str::random(10),
                'team_id' => 1,
            ],
        ];

        foreach ($items as $item) {
            $user = new User();
            $user->name = $item['name'];
            $user->email = $item['email'];
            $user->email_verified_at = $item['email_verified_at'];
            $user->password = $item['password'];
            $user->remember_token = $item['remember_token'];
            $user->team_id = $item['team_id'];
            $user->save();
        }
    }

    public function eventTypes()
    {
        $items = [
            ['Book out', 'book_out', '#E3E3E3', '#2A2A2A'],
            ['Casting', 'casting', '#C9DAFA', '#233453'],
            ['Go & See', 'go_see', '#FAE0B5', '#3F311C'],
            ['Job', 'job', '#BEEEB7', '#254620'],
            ['Note', 'note', '#ECECEC', '#202020'],
            ['Option', 'option', '#B7E5EB', '#1E4348'],
            ['Test', 'test', '#F6CACA', '#522A2A'],
            ['Fitting', 'fitting', '#DFCFE5', '#402E47']
        ];

        foreach ($items as $item) {
            $eventType = new EventType();
            $eventType->name = $item[0];
            $eventType->system_name = $item[1];
            $eventType->color_light_theme = $item[2];
            $eventType->color_dark_theme = $item[3];
            $eventType->save();
        }
    }

    public function talentHairColors()
    {
        $items = [
            ['Black', 'black'],
            ['Brown', 'brown'],
            ['Auburn', 'auburn'],
            ['Red', 'red'],
            ['Blond', 'blond']
        ];

        foreach ($items as $item) {
            $talentHairColor = new TalentHairColor();
            $talentHairColor->system_name = $item[1];
            $talentHairColor->name = $item[0];
            $talentHairColor->save();
        }
    }

    public function talentHairLengths()
    {
        $items = [
            ['Bald', 0],
            ['Short', 1],
            ['Medium', 2],
            ['Long', 3]
        ];

        foreach ($items as $item) {
            $talentHairLength = new TalentHairLength();
            $talentHairLength->name = $item[0];
            $talentHairLength->weight = $item[1];
            $talentHairLength->save();
        }
    }

    public function talentEyeColors()
    {
        $items = [
            ['Brown', 'brown'],
            ['Amber', 'amber'],
            ['Hazel', 'hazel'],
            ['Green', 'green'],
            ['Blue', 'blue'],
            ['Gray', 'gray'],
            ['Two different colors', 'two-different-colors']
        ];

        foreach ($items as $item) {
            $talentEyeColor = new TalentEyeColor();
            $talentEyeColor->system_name = $item[1];
            $talentEyeColor->name = $item[0];
            $talentEyeColor->save();
        }
    }

    public function talentCupSizes()
    {
        $items = [
            ['A', 0],
            ['B', 1],
            ['C', 2]
        ];

        foreach ($items as $item) {
            $talentCupSize = new TalentCupSize();
            $talentCupSize->name = $item[0];
            $talentCupSize->weight = $item[1];
            $talentCupSize->save();
        }
    }

    public function talentShoeSizes()
    {
        //source: https://en.wikipedia.org/wiki/Shoe_size#Conversion_between_US_and_UK_sizing

        $items = [
            ['(12)', '(12.25)', '1', 0],
            ['(12.5)', '(12.75)', '1.5', 1],
            ['0 (13)', '1 (13.25)', '2', 2],
            ['0.5 (13.5)', '1.5', '2.5', 3],
            ['1', '2', '3', 4],
            ['1.5', '2.5', '3.5', 5],
            ['2', '3', '4', 6],
            ['2.5', '3.5', '4.5', 7],
            ['3', '4', '5', 8],
            ['3.5', '4.5', '5.5', 9],
            ['4', '5', '6', 10],
            ['4.5', '5.5', '6.5', 11],
            ['5', '6', '7', 12],
            ['5.5', '6.5', '7.5', 13],
            ['6', '7', '8', 14],
            ['6.5', '7.5', '8.5', 15],
            ['7', '8', '9', 16],
            ['7.5', '8.5', '9.5', 17],
            ['8', '9', '10', 18],
            ['8.5', '9.5', '10.5', 19],
            ['9', '10', '11', 20],
            ['9.5', '10.5', '11.5', 21],
            ['10', '11', '12', 22],
            ['10.5', '11.5', '12.5', 23],
            ['11', '12', '13', 24],
            ['11.5', '12.5', '13.5', 25],
            ['12', '13', '14', 26],
            ['12.5', '13.5', '14.5', 27],
            ['13', '14', '15', 28],
            ['13.5', '14.5', '15.5', 29],
            ['14', '15', '16', 30],
            ['14.5', '15.5', '16.5', 31],
            ['15', '16', '17', 32],
            ['15.5', '16.5', '17.5', 33],
            ['16', '17', '18', 34]
        ];

        foreach ($items as $item) {
            $talentShoeSize = new TalentShoeSize();
            $talentShoeSize->size_adult_uk = $item[0];
            $talentShoeSize->size_adult_us_men = $item[1];
            $talentShoeSize->size_adult_us_women = $item[2];
            $talentShoeSize->weight = $item[3];
            $talentShoeSize->save();
        }
    }

    public function talentSkinColors()
    {
        $items = [
            ['Light', 'light'],
            ['Dark', 'dark']
        ];

        foreach ($items as $item) {
            $talentSkinColor = new TalentSkinColor();
            $talentSkinColor->system_name = $item[1];
            $talentSkinColor->name = $item[0];
            $talentSkinColor->save();
        }
    }

    public function talentMaritalStatuses()
    {
        $items = [
            ['Divorced'],
            ['Married'],
            ['Single'],
            ['Widowed']
        ];

        foreach ($items as $item) {
            $talentMaritalStatus = new TalentMaritalStatus();
            $talentMaritalStatus->name = $item[0];
            $talentMaritalStatus->save();
        }
    }

    public function talentRelativeTypes()
    {
        $items = [
            ['Father'],
            ['Mother'],
            ['Brother'],
            ['Sister'],
            ['Unkle'],
            ['Aunt'],
            ['Child'],
            ['Grandmother'],
            ['Grandfather'],
            ['Husband'],
            ['Wife']
        ];

        foreach ($items as $item) {
            $talentRelativeType = new TalentRelativeType();
            $talentRelativeType->name = $item[0];
            $talentRelativeType->save();
        }
    }
    public function talentGenders()
    {
        $items = [
            ['Male'],
            ['Female'],
            ['Transgender'],
            ['Gender neutral'],
            ['Non-binary'],
            ['Agender'],
            ['Pangender'],
            ['Genderqueer'],
            ['Two-spirit'],
            ['Third gender']
        ];

        foreach ($items as $item) {
            $talentGender = new TalentGender();
            $talentGender->name = $item[0];
            $talentGender->save();
        }
    }

    public function talentShirtSizes()
    {
        $items = [
            ['XS', 0],
            ['S', 1],
            ['M', 2],
            ['L', 3],
            ['XL', 4],
            ['XXL', 5],
        ];

        foreach ($items as $item) {
            $talentShirtSize = new TalentShirtSize();
            $talentShirtSize->name = $item[0];
            $talentShirtSize->weight = $item[1];
            $talentShirtSize->save();
        }
    }

    public function talentSuitCuts()
    {
        $items = [
            ['Short', 0],
            ['Medium', 1],
            ['Long', 2]
        ];

        foreach ($items as $item) {
            $talentSuitCut = new TalentSuitCut();
            $talentSuitCut->name = $item[0];
            $talentSuitCut->weight = $item[1];
            $talentSuitCut->save();
        }
    }

    public function talentDressSizes()
    {
        $items = [
            ['A', 0],
            ['B', 1],
            ['C', 2]
        ];

        foreach ($items as $item) {
            $talentDressSize = new TalentDressSize();
            $talentDressSize->name = $item[0];
            $talentDressSize->weight = $item[1];
            $talentDressSize->save();
        }
    }

    public function countries()
    {
        // Countries file taken from here: https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/slim-2/slim-2.json

        $json = Storage::disk('local')->get('/countries.json');
        $items = json_decode($json, true);

        foreach ($items as $item) {
            $country = new Country();
            $country->name = $item['name'];
            $country->alpha_2 = $item['alpha-2'];
            $country->country_code = $item['country-code'];
            $country->save();
        }
    }

    public function languages()
    {
        // Languages file taken from here: https://github.com/ihmpavel/all-iso-language-codes/tree/master/data/en
        // Next level of languages could be taken from here if needed: https://github.com/freearhey/iso-639-3

        $json = Storage::disk('local')->get('/languages.json');
        $items = json_decode($json, true);

        foreach ($items as $key => $value) {
            $language = new Language();
            $language->id = $key;
            $language->name = $value;
            $language->save();
        }
    }

    public function socialMediaTypes()
    {
        $items = [
            ['Facebook', 'https://www.facebook.com/', 'facebook'],
            ['Instagram', 'https://www.instagram.com/', 'instagram'],
            ['TikTok', 'https://www.tiktok.com/', 'tiktok'],
            ['X', 'https://x.com/', 'twitter'],
            ['YouTube', 'https://www.youtube.com/', 'youtube'],
        ];

        foreach ($items as $item) {
            $socialMediaType = new SocialMediaType();
            $socialMediaType->name = $item[0];
            $socialMediaType->url = $item[1];
            $socialMediaType->system_name = $item[2];
            $socialMediaType->save();
        }
    }

    public function messengerTypes()
    {
        $items = [
            ['Messenger', 'https://m.me/', 'facebook-messenger'],
            ['Telegram', 'https://t.me/', 'telegram'],
            ['WeChat', '', 'wechat'],
            ['WhatsApp', 'https://wa.me/', 'whatsapp'],
        ];

        foreach ($items as $item) {
            $socialMediaType = new MessengerType();
            $socialMediaType->name = $item[0];
            $socialMediaType->url = $item[1];
            $socialMediaType->system_name = $item[2];
            $socialMediaType->save();
        }
    }
}
