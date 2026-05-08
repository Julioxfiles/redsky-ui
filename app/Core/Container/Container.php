<?php

namespace App\Core\Container;

use Closure;
use ReflectionClass;
use ReflectionParameter;
use RuntimeException;

class Container
{
    /*
    |--------------------------------------------------------------------------
    | BINDINGS
    |--------------------------------------------------------------------------
    */

    protected array $bindings = [];

    /*
    |--------------------------------------------------------------------------
    | SHARED INSTANCES
    |--------------------------------------------------------------------------
    */

    protected array $instances = [];

    /*
    |--------------------------------------------------------------------------
    | BIND
    |--------------------------------------------------------------------------
    */

    public function bind(
        string $abstract,
        mixed $concrete = null
    ): void {

        if ($concrete === null) {
            $concrete = $abstract;
        }

        $this->bindings[$abstract] = [
            'concrete' => $concrete,
            'shared'   => false,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | SINGLETON
    |--------------------------------------------------------------------------
    */

    public function singleton(
        string $abstract,
        mixed $concrete = null
    ): void {

        if ($concrete === null) {
            $concrete = $abstract;
        }

        $this->bindings[$abstract] = [
            'concrete' => $concrete,
            'shared'   => true,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | GET / MAKE
    |--------------------------------------------------------------------------
    */

    public function get(string $abstract)
    {
        return $this->make($abstract);
    }

    public function make(string $abstract)
    {
        /*
        |--------------------------------------------------------------------------
        | RETURN EXISTING SINGLETON
        |--------------------------------------------------------------------------
        */

        if (isset($this->instances[$abstract])) {
            return $this->instances[$abstract];
        }

        /*
        |--------------------------------------------------------------------------
        | GET BINDING
        |--------------------------------------------------------------------------
        */

        $binding = $this->bindings[$abstract] ?? null;

        $concrete = $binding['concrete'] ?? $abstract;

        $shared = $binding['shared'] ?? false;

        /*
        |--------------------------------------------------------------------------
        | BUILD INSTANCE
        |--------------------------------------------------------------------------
        */

        $object = $this->build($concrete);

        /*
        |--------------------------------------------------------------------------
        | STORE SINGLETON
        |--------------------------------------------------------------------------
        */

        if ($shared) {
            $this->instances[$abstract] = $object;
        }

        return $object;
    }

    /*
    |--------------------------------------------------------------------------
    | BUILD OBJECT
    |--------------------------------------------------------------------------
    */

    protected function build(mixed $concrete)
    {
        /*
        |--------------------------------------------------------------------------
        | FACTORY CLOSURE
        |--------------------------------------------------------------------------
        */

        if ($concrete instanceof Closure) {
            return $concrete($this);
        }

        /*
        |--------------------------------------------------------------------------
        | REFLECTION
        |--------------------------------------------------------------------------
        */

        $reflection = new ReflectionClass($concrete);

        /*
        |--------------------------------------------------------------------------
        | NOT INSTANTIABLE
        |--------------------------------------------------------------------------
        */

        if (!$reflection->isInstantiable()) {

            throw new RuntimeException(
                "Class [$concrete] is not instantiable."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | CONSTRUCTOR
        |--------------------------------------------------------------------------
        */

        $constructor = $reflection->getConstructor();

        /*
        |--------------------------------------------------------------------------
        | NO CONSTRUCTOR
        |--------------------------------------------------------------------------
        */

        if (!$constructor) {
            return new $concrete();
        }

        /*
        |--------------------------------------------------------------------------
        | RESOLVE DEPENDENCIES
        |--------------------------------------------------------------------------
        */

        $dependencies = array_map(
            fn (ReflectionParameter $parameter)
                => $this->resolveDependency($parameter),
            $constructor->getParameters()
        );

        /*
        |--------------------------------------------------------------------------
        | CREATE INSTANCE
        |--------------------------------------------------------------------------
        */

        return $reflection->newInstanceArgs($dependencies);
    }

    /*
    |--------------------------------------------------------------------------
    | RESOLVE PARAMETER
    |--------------------------------------------------------------------------
    */

    protected function resolveDependency(
        ReflectionParameter $parameter
    ) {

        $type = $parameter->getType();

        /*
        |--------------------------------------------------------------------------
        | NO TYPE
        |--------------------------------------------------------------------------
        */

        if (!$type) {

            if ($parameter->isDefaultValueAvailable()) {
                return $parameter->getDefaultValue();
            }

            throw new RuntimeException(
                "Cannot resolve parameter [$parameter]"
            );
        }

        /*
        |--------------------------------------------------------------------------
        | BUILTIN TYPE
        |--------------------------------------------------------------------------
        */

        if ($type->isBuiltin()) {

            if ($parameter->isDefaultValueAvailable()) {
                return $parameter->getDefaultValue();
            }

            throw new RuntimeException(
                "Cannot resolve builtin parameter [$parameter]"
            );
        }

        /*
        |--------------------------------------------------------------------------
        | CLASS DEPENDENCY
        |--------------------------------------------------------------------------
        */

        return $this->make($type->getName());
    }

    /*
    |--------------------------------------------------------------------------
    | HAS BINDING
    |--------------------------------------------------------------------------
    */

    public function has(string $abstract): bool
    {
        return isset($this->bindings[$abstract])
            || isset($this->instances[$abstract]);
    }

    public function instance(string $abstract, mixed $instance): void
    {
        $this->instances[$abstract] = $instance;
    }
}