// modules
import { n_run_time } from "./ECS/EntityComponentSystem";
import { n_entity_registry } from "./ECS/EntityComponentSystem";
import { n_component_registry } from "./ECS/EntityComponentSystem";
import { n_system_registry } from "./ECS/EntityComponentSystem";
import { n_InstanceReplicator } from "./libraries/InstanceReplicator";
import { c_TaskSchedular } from "./libraries/TaskSchedular";
import { c_EnumList } from "./libraries/EnumList";

// entities
import { n_EnemyGlobals } from "./EnemyUnits/EnemyGlobals";
import { n_SpiderBot } from "./EnemyUnits/SpiderBot";

const EntityHashRegistry: {[key: string]: any} = {
    ["n_SpiderBot"]: n_SpiderBot,
};

const ReplicatedStorage = game.GetService("ReplicatedStorage");

// network
const GetEnemyLoop = new Instance("BindableEvent");
GetEnemyLoop.Name = "GetEnemyLoop";
GetEnemyLoop.Parent = ReplicatedStorage;

const ChangeEnemySpawning = new Instance("RemoteEvent");
ChangeEnemySpawning.Name = "ChangeEnemySpawning";
ChangeEnemySpawning.Parent = ReplicatedStorage

let shouldEnemiesSpawn = true;

// initialize coroutine
let co_enemyLoop = coroutine.wrap(function(allocatedSize: number, a: number, search: Instance){

    // initialize instance replicator
    n_InstanceReplicator.Initialize();
    let dynamicBuild = n_run_time.ECSDynamicBuild();
    n_run_time.SetECList(dynamicBuild)
    let bufferObject = n_InstanceReplicator.CreateBuffer(allocatedSize);
    const frequency = n_InstanceReplicator.CalculateFrequency(a);
    const networkBridge = n_InstanceReplicator.CreateNetworkBridge("NetworkPort");
    let PrimitiveFolder: Folder | undefined = game.Workspace.CurrentCamera?.FindFirstChildOfClass("Folder");
    
    function UpdatePrimitives(listOfEntityIds: number[],listOfPrimitives: Folder) {
        // for each primitive add an id to it and replicate to client using the first integer with a id followed
        // by and began by 4 zeros such as 0000420000 to let the client know this is an id and should be attached
        // onto the entity it can find with the serialized id
        // n_InstanceReplicator.SetPrimitiveTags()
    }

    function SerializeAllChildren(searchMap: BasePart[]) {
        // posible have enemy spawner set a tag as the position initally that we want to spawn at!
        let serializedIds = new Map<string, [Instance, string]>();
        for (const child of searchMap) {
                let serializedId = n_InstanceReplicator.SerializeInstance(child, false); // render tags are useless
                let binding: [BasePart, string]  = [child, serializedId];
                serializedIds.set(child.Name, binding);
                // clients can just verify if the entity already exists in their scene
            }

        for (const binding of serializedIds) { // replace hello parameter with entity id from get current entites
            // using indexed list of elements, these are not ordinal
            // position needs to be changed from what ever we get from
            /*
                ECS.GetAllEntities() => [Immutable list of entity ids]
 
                ECS.GetEntityPositionComponent(target) => CFrame.Position[Vector3]
            */

                if (binding[1][0].IsA("BasePart")) {
                    n_InstanceReplicator.ServerMakePrimitive(binding[1][0].Position, binding[1][1]);
                    n_InstanceReplicator.SetPrimitiveAttribute(binding[1][1], "Moving", false);
                    let Primitive = n_InstanceReplicator.ServerGetPrimitive(binding[1][1]);
                    let target = n_entity_registry.CreateShell(
                        ["InstanceComponent", "AiComponent", "PathfindingComponent"],
                        {["InstanceComponent"]: [Primitive, Primitive?.ClassName],
                         ["AiComponent"]: {
                            ["WalkSpeed"]: binding[1][0].GetAttribute("WalkSpeed"),
                            ["Health"]: binding[1][0].GetAttribute("Health"),
                            ["JumpPower"]: binding[1][0].GetAttribute("JumpPower")
                        }, // instances in search map must contain configuration details
                        ["PathfindingComponent"]: {
                            ["Radius"]: binding[1][0].GetAttribute("Radius"),
                            ["Height"]: binding[1][0].GetAttribute("Height"),
                            ["CanJump"]: binding[1][0].GetAttribute("CanJump"),
                            ["WaypointSpacing"]: binding[1][0].GetAttribute("WaypointSpacing"),
                        }
                        },
                        n_component_registry,
                        n_entity_registry,
                    )

                    n_EnemyGlobals.LinkEntityToEnemy(target, Primitive);
                } 
                else if (binding[1][0].IsA("Model")) {
                    let _root = binding[1][0].PrimaryPart;

                    if (_root) {
                        n_InstanceReplicator.ServerMakePrimitive(_root.Position, binding[1][1]);
                        n_InstanceReplicator.SetPrimitiveAttribute(binding[1][1], "Moving", false);

                        let Primitive = n_InstanceReplicator.ServerGetPrimitive(binding[1][1]);
                        let target = n_entity_registry.CreateShell(
                        ["InstanceComponent", "AiComponent", "PathfindingComponent"],
                        {["InstanceComponent"]: [Primitive, Primitive?.ClassName],
                         ["AiComponent"]: {
                            ["WalkSpeed"]: binding[1][0].GetAttribute("WalkSpeed"),
                            ["Health"]: binding[1][0].GetAttribute("Health"),
                            ["JumpPower"]: binding[1][0].GetAttribute("JumpPower")
                        }, // instances in search map must contain configuration details
                        ["PathfindingComponent"]: {
                            ["Radius"]: binding[1][0].GetAttribute("Radius"),
                            ["Height"]: binding[1][0].GetAttribute("Height"),
                            ["CanJump"]: binding[1][0].GetAttribute("CanJump"),
                            ["WaypointSpacing"]: binding[1][0].GetAttribute("WaypointSpacing"),
                        }
                        },
                        n_component_registry,
                        n_entity_registry,
                    )

                    n_EnemyGlobals.LinkEntityToEnemy(target, Primitive);
                    }
                }
                else {
                    error("Failed to make primitive, folder of entities to copy contains unsupported instance(s)")
                }
                
        }
    }

    const searchChildren: any[] = search.GetChildren();
    SerializeAllChildren(searchChildren);

    while (shouldEnemiesSpawn) {
        task.wait(frequency);
        let FormattedBuffer = n_InstanceReplicator.SetBuffer(bufferObject);
        let entities = n_entity_registry.GetAllEntities();

        if (PrimitiveFolder) {
            UpdatePrimitives(entities, PrimitiveFolder);
        }

        // go through entities
        // example:
        // link on creation n_SpiderBot.L()
        // EntityHashRegistry["n_"+Primitive.Name].MoveTo :n_SpiderBot.MoveTo()
        
        // as instances get removed the format edits itself

        // spatial hashmaps to limit ComputeAsync calls on enemies in extremely similar vector positions

        // call MoveTo system on pathfinding component

        // check entities health, if less than or equal to zero, destroy entity and primitive

        // data writing (positions of each primitive)

        // sending over the network
        networkBridge.FireAllClients(FormattedBuffer);
        print("Sending buffer over network!")
    }
})


// event recieved begins the loop buffer size is given
GetEnemyLoop.Event.Once(function(...args: unknown[]){
    assert(args.size() === 3, "Expected 3 arguments for get enemy loop: Size of buffer, Network frequency and search");


    assert(type(args[0]) === "number", "Argument #0, must be of type number");
    assert(type(args[1]) === "number", "Argument #1, must be of type number");
    assert(args[2], "Missing argument #3 of tuple, missing instance for search");

    // cast args
    const arg0 = args[0] as number;
    const arg1 = args[1] as number;
    const arg2 = args[2] as Instance;
    co_enemyLoop(arg0, arg1, arg2);
})

ChangeEnemySpawning.OnServerEvent.Connect(function(player, ...args: unknown[]){
    assert(args.size() === 1, "Expected 1 arguments for set enemy spawning");

    assert(type(args[0]) === "boolean", "Argument #0, must be of type boolean");


    // cast args
    const arg0 = args[0] as boolean;

    shouldEnemiesSpawn = arg0;
})