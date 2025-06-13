<?php

namespace App\Http\Controllers;

use App\Models\TalentBoard;
use App\Http\Requests\TalentBoardRequest;
use App\Http\Resources\TalentBoardCollection;

use Illuminate\Support\Facades\Auth;

class TalentBoardController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(TalentBoard::class);
    }

    public function index()
    {
        $talentBoards = TalentBoard::where('team_id', Auth::user()->team_id)
            ->orderBy('name', 'asc')
            ->get();
        return new TalentBoardCollection($talentBoards);
    }

    public function show(TalentBoard $talentBoard)
    {
        $talentBoard->load('createdBy', 'updatedBy');
        return $talentBoard->toResource();
    }

    public function update(TalentBoardRequest $request, TalentBoard $talentBoard)
    {
        $validated = $request->validated();
        $talentBoard->update($validated);

        return $this->show($talentBoard);
    }

    public function store(TalentBoardRequest $request)
    {
        $talentBoard = new TalentBoard();
        $user = Auth::user();
        $validated = $request->validated();

        $talentBoard->fill($validated);
        $talentBoard->team_id = $user->team->id;
        $talentBoard->save();

        return $this->show($talentBoard);
    }

    public function destroy(TalentBoard $talentBoard)
    {
        $talentBoard->delete();
        return response()->json(null, 204);
    }
}
