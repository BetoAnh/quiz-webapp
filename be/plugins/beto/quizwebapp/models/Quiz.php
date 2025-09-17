<?php
namespace Beto\Quizwebapp\Models;

use Model;

class Quiz extends Model
{
    use \October\Rain\Database\Traits\Validation;
    use \October\Rain\Database\Traits\Sluggable;

    protected $table = 'beto_quizwebapp_quizzes';

    // Chỉ cho phép mass assign đúng field cần
    protected $fillable = ['title', 'description', 'visibility', 'author_id'];

    public $slugs = ['slug' => 'title'];

    public $belongsTo = [
        'author' => ['RainLab\User\Models\User', 'key' => 'author_id']
    ];

    public $hasMany = [
        'questions' => [Question::class]
    ];

    public $rules = [
        'title' => 'required|string|max:255'
    ];
}
