<?php

namespace App\Domains\HomeAssistant\Events;

use App\Domains\HomeAssistant\DTO\HomeAssistantEntity;

/**
 * @extends HAWSEvent<HomeAssistantEntity>
 */
final class HAWSEntitiesSynchronized extends HAWSEvent
{
    /**
     * @param  array<array-key, HomeAssistantEntity>  $entities
     */
    public function __construct(
        array $entities,
    ) {
        parent::__construct('entities_synchronized', $entities);
    }
}
