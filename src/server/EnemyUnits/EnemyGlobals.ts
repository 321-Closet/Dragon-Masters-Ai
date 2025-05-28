// This translation unit provides enemy specific units with methods that each enemy requires


// type imports
import { ShellInput } from "shared/Typedefs/typedefinitons";

export namespace n_EnemyGlobals {
    export function LinkEntityToEnemy(target: ShellInput, primitive: Instance | undefined) {
        if (primitive) {
            primitive.SetAttribute("EntityId", target.id);
        }
        
    }
}