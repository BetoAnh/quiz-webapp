<?php
namespace Beto\Quizwebapp\Controllers;

use Backend\Classes\Controller;
use BackendMenu;
use Beto\Quizwebapp\Models\Quiz;
use Beto\Quizwebapp\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class QuizController extends Controller
{
    public function __construct()
    {
        parent::__construct();
        BackendMenu::setContext('Beto.Quizwebapp', 'quiz', 'quizcontroller');
    }

    /**
     * API: Lấy tất cả quiz + questions
     */
    public function index()
    {
        $quizzes = Quiz::get();
        return response()->json($quizzes);
    }

    /**
     * API: Lấy 1 quiz theo id
     */
    public function show($id)
    {
        $quiz = Quiz::with('questions')->find($id);
        if (!$quiz) {
            return response()->json(['error' => 'Quiz not found'], 404);
        }
        return response()->json($quiz);
    }

    /**
     * API: Tạo quiz + questions
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'questions.*.text' => 'required|string',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.correctId' => 'nullable|integer',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 401);
        }

        return DB::transaction(function () use ($request, $user) {
            $quiz = new Quiz;
            $quiz->title = $request->title;
            $quiz->slug = $request->slug ?? Str::slug($request->title . '-' . Str::random(5));
            $quiz->description = $request->description ?? '';
            $quiz->visibility = $request->visibility ?? 'public';
            $quiz->author_id = $user->id;
            $quiz->save();

            foreach ($request->questions ?? [] as $q) {
                $quiz->questions()->create([
                    'text' => $q['text'],
                    'options' => $q['options'],
                    'correct_id' => $q['correctId'] ?? null,
                ]);
            }

            return response()->json([
                'success' => true,
                'quiz' => $quiz->load('questions')
            ], 201);
        });
    }


    /**
     * API: Xóa quiz + questions
     */
    public function destroy($id)
    {
        $quiz = Quiz::find($id);
        if (!$quiz) {
            return response()->json(['error' => 'Quiz not found'], 404);
        }

        // nếu DB đã cascade delete thì bỏ dòng này
        $quiz->questions()->delete();
        $quiz->delete();

        return response()->json(['success' => true]);
    }
}
