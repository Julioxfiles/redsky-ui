<?php
// bootstrap/helpers.php

use App\Http\Components\Html;
use App\Http\Components\Form;

// Alias global en minúsculas (estilo Laravel)
class_alias(Html::class, 'html'); // Alias global
class_alias(Form::class, 'form');