<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

use App\Models\Company;
use App\Models\Contact;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        $result = array();
        $companies = Company::where('team_id', Auth::user()->team->id)
            ->get();
        $contacts = Contact::where('team_id', Auth::user()->team->id)
            ->get();

        foreach ($companies as $company) {
            $item = array();
            $item['type'] = get_class($company);
            $item['id'] = $company['id'];
            $item['name'] = $company['name'];
            $result[] = $item;
        }

        foreach ($contacts as $contact) {
            $item = array();
            $item['type'] = get_class($contact);
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
