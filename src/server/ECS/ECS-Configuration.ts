export function MakeECSConfiguration() {
    const ECS = {
        InstanceComponent: {
            // [n] = [Instance, type]
            // sys: destroy: destroy instance 
            // combat components added based off of base part tag
        },

        PathfindingComponent: {
            // [n] = {Radius = n, Height = n, CanJump = bool, Waypoint spacing}
            // sys: ComputePathAsyncronusly: ret wayPoint array
        },

        AiComponent: {
            // [n] = Ai: {MovementSpeed, Health, JumpPower, Name}
        }
    }

    return ECS;
}