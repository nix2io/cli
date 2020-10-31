export default interface PackageJSONType {
    name: string;
    version: string;
    description: string;
    keywords?: string[];
    homepage?: string;
    license: string;
    author?: string | { name: string; url: string };
    main?: string;
    files?: string[];
    repository?: string | { type: string; url: string };
    scripts?: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
}
