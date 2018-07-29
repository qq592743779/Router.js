class Router {
    constructor(){
        //  以键值对的形式存储路由
        this.routes = {}; 
        //  存储当前的路由
        this.currentUrl = '';
        this.refresh = this.refresh.bind(this);
        window.addEventListener('load', this.refresh);
        window.addEventListener('hashchange', this.refresh);
    }
    //  将path路径与对应路径的callback函数存储
    route(path, callback){
        this.routes[path] = callback || function() {};
    }
    //  刷新
    refresh(){
        //  获取当前URL的hash路径
        this.currentUrl = window.location.hash.slice(1) || '/';
        //  执行当前hash路径的callback函数
        this.routes[this.currentUrl]();
    }
}
