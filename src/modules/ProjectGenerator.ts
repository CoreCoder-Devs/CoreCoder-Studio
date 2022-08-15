/**
 * Project Generator
 * the purpose of this module is to create project skeletons
 * it has many options that can be customized
 * and it's very modular
 */

import CoreCoder from "./CoreCoder";
import File from "./File";
import { ProjectData } from "./ProjectManager";

export class PackHeader {
    name: string = "pack.name";
    description: string = "pack.desc";
    uuid: string = "pack.uuid";
    version: number[] = [0, 0, 1];
    min_engine_version: number[] = [1, 16, 100];
}

export declare type PackModuleType = "data" | "resource" | "script";

export class PackModule {
    type!: PackModuleType | string;
    uuid!: string;
    version!: number[];
}

export class Dependency {
    uuid!: string;
    version!: number[];
}

export class Manifest {
    format_version: number = 2;
    header: PackHeader = new PackHeader();
    modules: Array<PackModule> = [];
    dependencies: Array<Dependency> = [];

    addDependency(dependency: Dependency): Manifest {
        this.dependencies.push(dependency);
        return this;
    }

    public static fromProjectData(data: ProjectData): Manifest {
        var r = new Manifest();
        r.header = {
            name: data.name,
            description: data.description,
            uuid: data.uuid,
            version: data.version,
            min_engine_version: [1, 16, 100]
        }

        if (data.dependencies instanceof Array<ProjectData>) {
            for (var d in data.dependencies) {
                let project = (data.dependencies[d] as ProjectData);
                r.addDependency({
                    uuid: project.uuid,
                    version: project.version
                });
            }
        } else if (data.dependencies instanceof ProjectData) {
            let project = (data.dependencies as ProjectData);
            r.addDependency({
                uuid: project.uuid,
                version: project.version
            });
        }
        return r;
    }
}

export default class ProjectGenerator {
    constructor() { }
    /**
     * Generates a project with the correct data
     * @param data Project Data
     * @param createDependencies Whether to create the dependencies projects or not
     * @returns success state
     */
    public static generateProject(data: ProjectData, createDependencies: boolean = true): boolean {
        // Get the project root
        var comMojang = CoreCoder.getComMojang();
        if (comMojang instanceof Error) return false;
        this.generateManifest(data, createDependencies);
        return true;
    }

    /**
     * Creates a manifest.json on a project with specific path
     * @param data The project to generate the files in
     * @returns Success state
     */
    private static generateManifest(data: ProjectData, generateDependencies: boolean = true): boolean {
        let manifest = Manifest.fromProjectData(data);
        let content = JSON.stringify(manifest);

        File.writeFile(data.path, content, true);

        if (generateDependencies) {
            if (data.dependencies instanceof Array<ProjectData>) {
                for (var p in data.dependencies) {
                    let project = data.dependencies[p] as ProjectData;
                    let manifest = Manifest.fromProjectData(project);
                    let content = JSON.stringify(manifest);
                    File.writeFile(project.path, content, true);
                }
            } else if (data.dependencies instanceof ProjectData) {
                let project = data.dependencies as ProjectData;
                let manifest = Manifest.fromProjectData(project);
                let content = JSON.stringify(manifest);
                File.writeFile(project.path, content, true);
            }
        }
        return true;
    }
};