<?php

namespace App\Core\Pipeline;

use Closure;
use App\Core\Container\Container;

class Pipeline
{
    protected Container $container;
    protected mixed $passable;
    protected array $pipes = [];
    protected string $method = 'handle';

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * Define el objeto que viajará por el pipeline (Request, etc.)
     */
    public function send(mixed $passable): self
    {
        $this->passable = $passable;

        return $this;
    }

    /**
     * Define los middleware / pipes
     */
    public function through(array $pipes): self
    {
        $this->pipes = $pipes;

        return $this;
    }

    /**
     * Define el método del middleware (handle por defecto)
     */
    public function via(string $method): self
    {
        $this->method = $method;

        return $this;
    }

    /**
     * Ejecuta el pipeline y termina en el destino final
     */
    public function then(Closure $destination): mixed
    {
        $pipeline = array_reduce(
            array_reverse($this->pipes),
            $this->carry(),
            $this->prepareDestination($destination)
        );

        return $pipeline($this->passable);
    }

    /**
     * Construye la cadena de ejecución (core del pipeline)
     */
    protected function carry(): Closure
    {
        return function ($stack, $pipe) {

            return function ($passable) use ($stack, $pipe) {

                $pipe = $this->resolvePipe($pipe);

                return $pipe->{$this->method}(
                    $passable,
                    $stack
                );
            };
        };
    }

    /**
     * Resuelve middleware desde Container
     */
    protected function resolvePipe(mixed $pipe): mixed
    {
        if ($pipe instanceof Closure) {
            return $pipe;
        }

        // Soporta strings tipo App\Middleware\AuthMiddleware
        return $this->container->make($pipe);
    }

    /**
     * Define el último paso del pipeline
     */
    protected function prepareDestination(Closure $destination): Closure
    {
        return function ($passable) use ($destination) {
            return $destination($passable);
        };
    }

    /**
     * Cambia el objeto que viaja (fluidez tipo Laravel interno)
     */
    public function pipe(mixed $passable): self
    {
        $this->passable = $passable;

        return $this;
    }
}

