// module imports
import { c_EnumList } from "server/libraries/EnumList";
import { n_InstanceReplicator } from "server/libraries/InstanceReplicator";
import { n_ECSTreeViewerServer } from "./ECS-TreeViewer";

// function import 
import { MakeECSConfiguration } from "./ECS-Configuration";

// type imports
import { ShellInput } from "shared/Typedefs/typedefinitons";

let eid = 0;
let ECList: {[key: string]: any} = {}; 
let entityList: number[] = [];

// ENTITES
export namespace n_entity_registry {  
    export function CreateShell(v: string[], componentMap: {[key: string]: any}, componentRegistry: {[key: string]: (...args: any )=>any}, entityRegistry: {[key: string]: (...args: any )=>any}) {
        let target = {id: eid+1, components: []};
        eid += 1
        const shell = componentRegistry.Add(target, v, componentMap, entityRegistry);
        entityList.insert(entityList.size() - 1, target.id);
        return shell;
    }  

    export function ConstructShell(id: number, shellComponents: string[]) {
        let shell = {id: id, components: shellComponents};
        // submit to wall nut
        return shell;
    }

    export function GetAllEntities(): number[] {
        return entityList;
    }

    export function DestroyShell(target: ShellInput) {
        
    }
}
// COMPONENTS
export namespace n_component_registry {
   

    export function Add(target: ShellInput, Components: string[], componentMap: {[key: string]: any}, entityRegistry: {[key: string]: (...args: any )=>any}) {
        // add components to shell, add components in ECS
        // old shell = shell;
        const id = target.id;
        let shellComponents = target.components;
        let index = shellComponents.size();
        for (const component of Components) {
            shellComponents.insert(index, component);
            index += 1;

            // find component
            debug.profilebegin("ECS-Component Modification");
            assert(ECList[component], "ECS was not configured correctly")
            ECList[component][id] = componentMap[component];
            debug.profileend();
        }

        let newTarget = entityRegistry.ConstructShell(id, shellComponents);
        return newTarget;
    }

    export function Remove(target: ShellInput, Components: string[]) {

    }

    export function ClearAll(target: ShellInput) {

    }

    export function HasComponent(target: ShellInput, component: string): boolean {
        for (const componentPair of target.components) {
            if (componentPair === component) {
                return true;
            }
            else {
                return false;
            }
        }

        return false;
    }
}

// SYSTEMS
export namespace n_system_registry {
    

    // AI systems

    export function CFrame_MoveTo(target: ShellInput) {
         // sets cframes
     }

    // Effect systems
}

export namespace n_run_time {
    // RUN-TIME
    export function ECSDynamicBuild() {
        return MakeECSConfiguration();
    }

    export function SetECList(dynamicBuild: {[key: string]: any}) {
        ECList = dynamicBuild;
    }
}