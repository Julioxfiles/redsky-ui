<?php
declare(strict_types=1);

/**
 * Session helpers.
 *
 * Helpers in this file:
 * - session()
 */

if (! function_exists('session')) {
    /**
     * Get or set session values.
     *
     * Examples:
     *  session('user_id');
     *  session('user_id', 10);
     *  session()->all();
     * 
     * Tambien puedes hacer:
     * $session = new \App\Core\Session\Session();
     * $session->put('user_id', 10);
     * $session->get('user_id');
     */
    
    function session($key = null, $value = null)
    {
        static $session;

        if (!$session) {
            $session = new \App\Core\Session\Session();
        }

        // SET multiple
        if (is_array($key)) {
            foreach ($key as $k => $v) {
                $session->put($k, $v);
            }
            return $session;
        }

        // SET single
        if ($value !== null) {
            $session->put($key, $value);
            return $session;
        }

        // GET ALL (tipo Laravel)
        if ($key === 'all') {
            return $session->all();
        }

        // GET single
        /*
        if ($key !== null) {
            return $session->get($key);
        }
        */

        // return store (Laravel style)
        return $session;
    }
}
