<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Contact;
use App\Models\CompanyContact;
use App\Models\Event;
use App\Models\EventChunk;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
    }

    public function index()
    {
        // $team_id = Auth::user()->team->id;
        $team_id = 1;
        $result = array();
        $companies = Company::where('team_id', $team_id)
            ->get();
        $contacts = Contact::where('team_id', $team_id)
            ->get();

        foreach ($companies as $company) {
            $item = array();
            $item['class'] = get_class($company);
            $item['id'] = $company['id'];
            $item['name'] = $company['name'];
            $result[] = $item;
        }

        foreach ($contacts as $contact) {
            $item = array();
            $item['class'] = get_class($contact);
            $item['id'] = $contact['id'];
            $item['name'] = $contact['first_name'] . ' ' . $contact['last_name'];
            $result[] = $item;
        }

        usort($result, function ($a, $b) {
            return strcmp($a['name'], $b['name']);
        });

        return $result;
    }
}
