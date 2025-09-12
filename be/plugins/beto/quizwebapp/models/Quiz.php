<?php namespace Beto\Quizwebapp\Models;

use Model;


/**
 * Model
 */
class Quiz extends Model
{
    use \October\Rain\Database\Traits\Validation;
    
    /**
     * @var string table in the database used by the model.
     */
    public $table = 'beto_quizwebapp_quizzes';

    /**
     * @var array rules for validation.
     */
    public $rules = [
    ];

    public $belongsTo = [
        'author' => 'RainLab\User\Models\User'
    ];

}
