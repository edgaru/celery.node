import Client from "./client";
import { AsyncResult } from "./result";

export default class Task {
  client: Client;
  name: string;

  /**
   * Asynchronous Task
   * @constructor Task
   * @param {Client} client celery client instance
   * @param {string} name celery task name
   */
  constructor(client: Client, name: string) {
    this.client = client;
    this.name = name;
  }

  /**
   * @method Task#delay
   *
   * @returns {AsyncResult} the result of client.publish
   *
   * @example
   * client.createTask('task.add').delay(1, 2)
   */
  public delay(...args: any[]): AsyncResult {
    return this.applyAsync([...args]);
  }

  /**
   * Apply task asynchronously
   * @param {Array<any>} args - Task arguments
   * @param {object} kwargs - Task keyword arguments
   * @param {object} options - Execution options (queue, etc.)
   * @returns {AsyncResult}
   */
  public applyAsync(
    args: Array<any>, 
    kwargs?: object, 
    options?: { queue?: string }  // ✅ Agregar parámetro options
  ): AsyncResult {
    if (args && !Array.isArray(args)) {
      throw new Error("args is not array");
    }
    if (kwargs && typeof kwargs !== "object") {
      throw new Error("kwargs is not object");
    }

    return this.client.sendTask(
      this.name, 
      args || [], 
      kwargs || {}, 
      undefined,     // taskId - deja que se genere automáticamente
      options        // ✅ Pasar options con queue
    );
  }
}
