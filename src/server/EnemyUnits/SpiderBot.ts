// This is one of many translation units that describe functionality for specific enemy types

// type imports
import { ShellInput } from "shared/Typedefs/typedefinitons";

// module imports
import { n_EnemyGlobals } from "./EnemyGlobals";
import { n_entity_registry } from "server/ECS/EntityComponentSystem";
import { n_component_registry } from "server/ECS/EntityComponentSystem";
import { n_system_registry } from "server/ECS/EntityComponentSystem";


export namespace n_SpiderBot {
    export function MoveTo(target: ShellInput, primitive: Part) {
        const entityHasPathfindingComponent = n_component_registry.HasComponent(target, "PathfindingComponent");
        const entityHasAiComponent = n_component_registry.HasComponent(target, "AiComponent");

        if (!entityHasPathfindingComponent && !entityHasAiComponent) {
            warn("Target: "+target.id+"does not contain a pathfinding or ai component");
        }

        print("MoveTo called on "+target.id);

        // perform spacial hasing to find similar entities that are NOT moving and are in the same cell
        // systemRegistry.moveto ...
    }
}