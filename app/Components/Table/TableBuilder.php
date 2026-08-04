<?php

declare(strict_types=1);

namespace App\Components\Table;

use RedSky\Html\Components\Table\Table;
use RedSky\Html\Components\Table\TableHead;
use RedSky\Html\Components\Table\TableBody;
use RedSky\Html\Components\Table\TableRow;
use RedSky\Html\Components\Table\TableHeaderCell;
use RedSky\Html\Components\Table\TableCell;

/**
 * Builds HTML tables from application data.
 *
 * This class belongs to redsky-ui because it
 * transforms data structures into HTML components.
 *
 * redsky-html only provides the HTML components.
 *
 * @package RedSky\Ui\Components\Table
 */
class TableBuilder
{
    /**
     * Generated table component.
     *
     * @var Table
     */
    protected Table $table;


    /**
     * Creates a new table builder.
     */
    public function __construct()
    {
        $this->table = new Table();
    }


    /**
     * Adds table headers.
     *
     * @param array<int, string> $headers
     *
     * @return static
     */
    public function headers(
        array $headers
    ): static {

        $head = new TableHead();

        $row = new TableRow();

        foreach ($headers as $header) {

            $row->addHeaderCell(
                new TableHeaderCell($header)
            );
        }

        $head->addRow($row);

        $this->table->head($head);

        return $this;
    }


    /**
     * Adds table data rows.
     *
     * @param array<int, array<int, mixed>> $rows
     *
     * @return static
     */
    public function rows(
        array $rows
    ): static {

        $body = new TableBody();


        foreach ($rows as $data) {

            $row = new TableRow();


            foreach ($data as $value) {

                $row->addCell(
                    new TableCell($value)
                );
            }


            $body->addRow($row);
        }


        $this->table->body($body);


        return $this;
    }


    /**
     * Returns the generated table.
     *
     * @return Table
     */
    public function build(): Table
    {
        return $this->table;
    }
}