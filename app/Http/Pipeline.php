<?php

namespace App\Http;

class Pipeline
{
    protected array $pipes = [];
    protected $passable;

    /**
     * Set the initial object (Request)
     */
    public function send($passable): self
    {
        $this->passable = $passable;

        return $this;
    }

    /**
     * Define middleware stack
     */
    public function through(array $pipes): self
    {
        $this->pipes = $pipes;

        return $this;
    }

    /**
     * Final destination (controller / core)
     */
    public function then(\Closure $destination)
    {
        // Build pipeline from inside out
        $pipeline = array_reduce(
            array_reverse($this->pipes),
            function ($next, $pipe) {
                return function ($passable) use ($next, $pipe) {

                    $pipeInstance = new $pipe;

                    return $pipeInstance->handle($passable, $next);
                };
            },
            $destination
        );

        // Execute full pipeline
        return $pipeline($this->passable);
    }
}