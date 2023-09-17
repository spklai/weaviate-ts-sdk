import { isValidStringProperty } from '../validation/string';
import Connection from '../connection';
import { CommandBase } from '../validation/commandBase';
import { WeaviateClass } from '../openapi/types';

export default class ClassUpdater extends CommandBase {
  private className?: string;
  private class!: WeaviateClass;

  constructor(client: Connection) {
    super(client);
  }

  withClassName = (className: string) => {
    this.className = className;
    return this;
  };

  validateClassName = () => {
    if (!isValidStringProperty(this.className)) {
      this.addError('className must be set - set with .withClassName(className)');
    }
  };

  withClass = (classObj: object) => {
    this.class = classObj;
    return this;
  };

  validateClass = () => {
    if (this.class == undefined || this.class == null) {
      this.addError('class object must be set - set with .withClass(class)');
    }
  };

  validate() {
    this.validateClassName();
    this.validateClass();
  }

  do = (): Promise<WeaviateClass> => {
    this.validateClass();
    if (this.errors.length > 0) {
      return Promise.reject(new Error('invalid usage: ' + this.errors.join(', ')));
    }
    const path = `/schema/${this.className}`;
    return this.client.put(path, this.class);
  };
}
