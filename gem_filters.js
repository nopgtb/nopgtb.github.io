
//Refreshes the url with the current filter parameters
function set_filter_url(checkbox){
    let filter_section = checkbox.className;
    let filter_value = checkbox.value;
    let filter_status_on = checkbox.checked;
    //Get url parameters
    let url_parameters = window.location.search.substring(1);
    //Need to process existing parameters?
    if(url_parameters){
        let url_filters = url_parameters.split("&");
        let key_found = false;
        //Loop trough each parameter
        for(let i = 0; i < url_filters.length; ++i){
            //Split key and values
            let key_values = url_filters[i].split("=");
            if(key_values && key_values[0] == filter_section){
                //Mark that we found the key in the url
                key_found = true;
                //Split values
                values = key_values[1].split(",");
                if(values){
                    //We should include value in url?
                    if(filter_status_on && !values.includes(filter_value)){
                        values.push(filter_value);
                    }
                    //We should remove value from url?
                    else if(!filter_status_on && values.includes(filter_value)){
                        let value_index = values.indexOf(filter_value);
                        values.splice(value_index, 1);
                    }
                    //Set values
                    key_values[1] = values.join(",")
                    //Set keys values if any left
                    if(key_values[1].length > 0){
                        url_filters[i] = key_values.join("=")
                    }
                    else{
                        //If none left, remove the key from url
                        url_filters.splice(i, 1);
                    }
                    
                }
            }
        }
        //If key does not exist in url
        if(!key_found){
            //Add key and value
            url_filters.push(filter_section + "=" + filter_value);
        }
        //Clean url if empty
        let url_filter_string = url_filters.join("&");
        if(url_filter_string){
            url_parameters = "?" + url_filter_string;
        }
        else{
            url_parameters = "";
        }
    }
    else{
        //No existing parameters, just set parameter
        url_parameters = "?" + filter_section + "=" + filter_value;
    }
    //Set url
    let new_url = location.origin + location.pathname +  url_parameters;
    window.history.pushState({}, "", new URL(new_url));
}

//Collects all the active color filters
function get_active_color_filters(){
    let active_color_filters = [];
    document.querySelectorAll("#gem-color > div > input").forEach(
        (element) => {
            //Loop trough all the checkboxes
            //Check if they are checked
            if(element.checked){
                active_color_filters.push(Number(element.value));
            }
        }
    );
    return active_color_filters;
}

//Collects all the active size filters
function get_active_size_filters(){
    let active_size_filters = [];
    document.querySelectorAll("#gem-size > div > input").forEach(
        (element) => {
            //Loop trough all the checkboxes
            //Check if they are checked
            if(element.checked){
                active_size_filters.push(Number(element.value));
            }
        }
    );
    return active_size_filters;
}

//Collects all the active size filters
function get_active_stat_filters(){
    let active_stats_filters = [];
    document.querySelectorAll("#gem-stat > div > input").forEach(
        (element) => {
            //Loop trough all the checkboxes
            //Check if they are checked
            if(element.checked){
                active_stats_filters.push(Number(element.value));
            }
        }
    );
    return active_stats_filters;
}

//Returns span containing formated stats info
function get_stat_element(stat_data, stats_table){
    let gem_stat_span = null;
    //Find stat info for current stat
    let stat_description = stats_table.find(stat => stat.eid == stat_data["eid"]);
    if(stat_description){
        gem_stat_span = document.createElement("span");
        gem_stat_span.className = "gem-stat";
        //Compose stat text from data
        let sign = "+";
        if(stat_data["amount"] < 0){
            sign = "-";
        }
        let stat_string = sign + Math.abs(stat_data["amount"]);
        if(stat_data["percentage"]){
            stat_string += "%";
        }
        stat_string += " " + stat_description["name"];
        gem_stat_span.innerText = stat_string;
    }
    return gem_stat_span;
}

function create_gem_display(gem_data){
    //Create base div
    let base_div = document.createElement("div");
    let socket_colors = gem_data["socket_color"];
    let base_div_class = "gem-listing " + "gem-bg-" + socket_colors.sort().join("");
    base_div.className = base_div_class;
    //Create info div
    let gem_info_div = document.createElement("div");
    gem_info_div.className = "gem-info text";
    //Create gem name 
    let gem_name_link = document.createElement("a");
    gem_name_link.className = "gem-name";
    gem_name_link.href = "https://www.wowhead.com/wotlk/item=" + gem_data.wowhead_item_id;
    gem_name_link.innerText = gem_data.name;
    gem_name_link.setAttribute("data-wh-rename-link", "false");
    gem_name_link.setAttribute("data-wh-iconize-link", "false");
    gem_name_link.setAttribute("data-wh-color-link", "false");
    gem_name_link.target = "_blank";
    gem_info_div.appendChild(gem_name_link);
    //Create stats info spans
    let gem_stat_div = document.createElement("div");
    let gem_stat_span = null;
    gem_data["gem_stats"].forEach( (stat_data) => {
        gem_stat_span = get_stat_element(stat_data, stats_table_);
        if(gem_stat_span){
            gem_stat_div.appendChild(gem_stat_span);
        }
    });
    gem_info_div.appendChild(gem_stat_div);
    //Create item link
    let gem_icon_div = document.createElement("div");
    gem_icon_div.className = "gem-icon";
    let item_link = document.createElement("a");
    item_link.href = "https://www.wowhead.com/wotlk/item=" + gem_data.wowhead_item_id;
    item_link.className = "q3";
    item_link.setAttribute("data-wowhead", "item=" + gem_data.wowhead_item_id);
    item_link.setAttribute("data-wh-icon-size", "medium");
    gem_icon_div.appendChild(item_link);
    //item_link.innerText = gem_data.name;
    //append link to base div
    base_div.appendChild(gem_info_div);
    base_div.appendChild(gem_icon_div);
    return base_div;
}

//Displays the given gem list
function display_gems(gem_list){
    let gem_display = document.getElementById("gem-display");
    gem_display.textContent = "";
    //Loop trough gems and create html for them
    gem_list.forEach(
        (gem) => {
            let gem_html = create_gem_display(gem);
            gem_display.appendChild(gem_html);
        }
    );
    //Refresh wowhead tooltips
    WH.Tooltips.refreshLinks();
}

//Applies the filters to the gem data and displays the resulting gems
function apply_filters(){
    //Get active filters
    let active_color_filters = get_active_color_filters();
    let active_size_filters = get_active_size_filters();
    let active_stats_filters = get_active_stat_filters();
    let gems_to_display = gem_table_;
    //Filter color
    if(active_color_filters.length > 0){
        //Gem needs to match all the colors
        gems_to_display = gems_to_display.filter(
            gem => active_color_filters.every(filter_val => gem.socket_color.includes(filter_val))
        );
    }
    //Filter size
    if(active_size_filters.length > 0){
        gems_to_display = gems_to_display.filter(
            gem => active_size_filters.includes(gem.gem_size)
        );
    }
    //Filter stats
    if(active_stats_filters.length > 0){
        //Gem needs to match all the stats
        gems_to_display = gems_to_display.filter(
            gem => active_stats_filters.every(filter_val => gem.gem_stats.some(stat_obj => stat_obj["eid"] == filter_val))
        );
    }
    //Display filtered gems
    display_gems(gems_to_display);
}

//Appends the filter info to the url and refreshes the gems
function filter_value_change(element){
    //Set URL parameters
    set_filter_url(element.target);
    //apply the new filters to the gem data
    apply_filters();
}

//Tries to create a checkbox element using the given data
function create_checkbox(element, section){
    //Element is enabled?
    if(element["use_for_sorting"]){
        //Create checkbox container div
        let checkbox_container = document.createElement("div");
        checkbox_container.className = "checkbox-container";
        //Create the checkbox
        let checkbox_name = (section + "-" + element["eid"]).toLowerCase();
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = section;
        checkbox.name = checkbox_name;
        checkbox.value = element["eid"];
        checkbox.addEventListener('change', e => {console.log(e);filter_value_change(e);});
        //Create label for checkbox
        let checkbox_label = document.createElement("label");
        checkbox_label.innerText = element["name"];
        checkbox_label.htmlFor = checkbox_name;
        //Append checkbox and label to container
        checkbox_container.appendChild(checkbox);
        checkbox_container.appendChild(checkbox_label);
        return checkbox_container;
    }
    return null;
}

//Initializes the color checkboxes using the data from color_table_.
function init_color_checkboxes(){
    //Loop trough color data
    color_table_.forEach(
        (element) => {
            //Create checkbox
            let checkbox_container = create_checkbox(element, "gem-color");
            if(checkbox_container){
                //Append to dom
                document.getElementById("gem-color").appendChild(checkbox_container);
            }
        }
    );
}

//Initializes the size checkboxes using the data from size_table_.
function init_size_checkboxes(){
    //Loop trough size data
    size_table_.forEach(
        (element) => {
            //Create checkbox
            let checkbox_container = create_checkbox(element, "gem-size");
            if(checkbox_container){
                //Append to dom
                document.getElementById("gem-size").appendChild(checkbox_container);
            }
        }
    );
}

//Initializes the stat checkboxes using the data from stats_table_.
function init_stat_checkboxes(){
    //Loop trough size data
    stats_table_.forEach(
        (element) => {
            //Create checkbox
            let checkbox_container = create_checkbox(element, "gem-stat");
            if(checkbox_container){
                //Append to dom
                document.getElementById("gem-stat").appendChild(checkbox_container);
            }
        }
    );
}

//Checks the url for selected filters
function init_gem_filter(){
    //Get url parameters
    let url_parameters = window.location.search.substring(1);
    if(url_parameters){
        let url_filters = url_parameters.split("&");
        //Loop trough each parameter
        url_filters.forEach(
            (filter) => {
                //Split key and values
                let key_values = filter.split("=");
                if(key_values){
                    //Split values
                    values = key_values[1].split(",");
                    if(values){
                        values.forEach(
                            (value) => {
                                //Enable filters by checking checkboxes
                                let filter_search_string = "#" + key_values[0] + " > div > input[name='"+ key_values[0] + "-" + value + "']"
                                let filter_checkbox = document.querySelector(filter_search_string);
                                if(filter_checkbox){
                                    filter_checkbox.checked = true;
                                }
                            }
                        );
                    }
                }
            }
        );
    }
}

function initialize(){
    //Initialize the checkboxes
    init_color_checkboxes();
    init_size_checkboxes();
    init_stat_checkboxes();
    //Initialize filters
    init_gem_filter();
    //apply the filters to the gem data
    apply_filters();
}

window.onload = initialize;