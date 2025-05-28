// @author: 321_Closet
/*
   @description: a multi-use schedular class to create task objects and schedule execution of threads and functions
   in translation units
*/

const HttpService = game.GetService("HttpService");

export class ScheduleParams {
   public PARAMS: number[] = []
   constructor(recurse: number, wait: number) {
      assert(recurse, "Attempt to create object schedule params with argument 1 missing or null");
      assert(wait, "Attempt to create object schedule params with argument 2 missing or null")
      this.PARAMS.insert(0, recurse); // n times to repeat
      this.PARAMS.insert(1, wait); // n times to wait before repeating
   }
}


export class c_TaskSchedular {
   private schedule: {[key: string]: any} = {};
   private ThreadCache: {[key: string]: any} = {};
   constructor() {
      const object = this
      return this;
   }

   /**
    * @method ScheduleThread: add a thread to the schedulars object list of tasks
    */
   public ScheduleThread(params: any[], ScheduleParams: ScheduleParams, co: thread) {
      assert(ScheduleParams, "Attempt to call function ScheduleFunction with missing argument #2")
      assert(co, "Attempt to call function ScheduleFunction with missing argument #3")
      const recurse = ScheduleParams.PARAMS[0];
       if (recurse > 0) {
         const elapse= ScheduleParams.PARAMS[1];

         for (let i =0; i <= recurse; i++) {
            task.wait(elapse);
            coroutine.resume(co, params);
         }
       }
   }

   /**
    * @method ScheduleFunction: add a function to the schedulars object list of tasks
    * Note: functions are given parameters as tables of given values, scheduled functions should
    * ensure to read the values from the given hashmaps correctly, parameters supplied for scheduled functions
    * must be in a hash format with key-value pairs for indexing
    * Example(luau): local function(parameters: {}) 
    *    print(parameters.Name)
    * end
    */
   public ScheduleFunction(params: any[], ScheduleParams: ScheduleParams, fn: (params: any[])=>any) {
      assert(ScheduleParams, "Attempt to call function ScheduleFunction with missing argument #2")
      assert(fn, "Attempt to call function ScheduleFunction with missing argument #3")
      const recurse = ScheduleParams.PARAMS[0];
      if (recurse > 0) {
         const elapse= ScheduleParams.PARAMS[1];
        let co = coroutine.wrap(function(): defined[]{
            let results: defined[] = [];
            let offset = 0;
            for (let i = 0; i <= recurse; i++) {
               task.wait(elapse)
               const result = fn(params);
               results.insert(offset, result);
               offset += 1;
            }

            return results;
         })

         return co();
      }
   }

   /**
    * @method Spawn: run a function or thread immediately through the schedular
    */
   public Spawn(f: ()=>void | thread) {
      task.spawn(f);
   }

   /**
    * @method SpawnAfter: run a function or thread immediately through the schedular after n has elapsed
    */
   public SpawnAfter(wait: number, f: ()=>void | thread) {
      task.delay(wait, function() {
         task.spawn(f);
      })
   }

   /**
    * @method CreateThread: returns a thread id of a new thread
    */
   public CreateThread(callback: ()=>any): string {
      const threadId = HttpService.GenerateGUID(false);
      let co = coroutine.create(callback);
      this.ThreadCache[threadId] = co;
      return threadId;
   }

   /**
    * @method ResumeThread: resumes a thread from the given thread id
    * @args: A mutable list of any
    */
   public ResumeThread(threadId: string, args: any[] | {}): void {
      assert(threadId, "Attempt to resume thread with argument #1 missing or nil")
      let co = this.ThreadCache[threadId];
      assert(co, "Unable to find thread from id")

      coroutine.resume(co, args);
      delete this.schedule[threadId];
   }

   /**
    * @method CancelThread: cancels the thread of given thread id
    */
   public CancelThread(threadId: string) {
      assert(this.ThreadCache[threadId], "Attempt to cancel non-existant thread");
      let co: thread = this.ThreadCache[threadId];
      coroutine.yield(co);
      coroutine.close(co);
   }

   /**
    * @method PauseThread: Pauses the given thread from threadId until x has elapsed
    */
   public PauseThread(x: number, threadId: string) {
      let co: thread = this.ThreadCache[threadId];
      assert(co, "Attempt to pause non-existant thread");
      coroutine.yield(co)

      task.delay(x, function(){
         coroutine.resume(co);
      })
   }
}