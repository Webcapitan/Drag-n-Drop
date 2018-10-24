const main = [
    {
        elem: 'block1',
        child: []
    },
    
    {
        elem: 'block2',
        child: []
    },
    {
        elem: 'block3',
        child: [
            {
                elem: 'block4',
                child: []
            }
        ]
    }, 
    {
        elem: 'block5',
        child: []
    },          
    {
        elem: 'block6',
        child: []
    },
    {
        elem: 'block7',
        child: []
    },
    {
        elem: 'block8',
        child: []
    },
    {
        elem: 'block9',
        child: []
    },
    {
        elem: 'block10',
        child: [
            {
                elem: 'block11',
                child: []
            }
        ]
    },
    {
        elem: 'block12',
        child: []
    }
];
let id = 100;
objectToHtml(main, document.getElementsByClassName('mycontainer')[0]);
classes();
const sortable = new Draggable.Sortable(document.querySelectorAll(".mycontainer"), {
    draggable: ".item",
    mirror: {
        constrainDimensions: true
    }
})
sortable.on('drag:move', (event) => {
    const mirrorStyle = document.querySelectorAll('.draggable-mirror')[0].style.cssText;
    const pos1 = mirrorStyle.indexOf('translate3d(');
    const pos2 = mirrorStyle.indexOf(')', pos1);
    const transform = mirrorStyle.substring(pos1 + 12, pos2).split(',');
    const y = parseFloat(transform[1].replace('px', ""));
    const x = parseFloat(transform[0].replace('px', ""));
    // -----
    const draggableItem = document.querySelectorAll('.draggable-source--is-dragging')[0];
    if (number(draggableItem) > 1) {
        var prev = previous(draggableItem);
        let offsetPrev = getOffset(prev).left;
        if (x - offsetPrev >= 20) {
            const container = prev.querySelectorAll('.mycontainer')[0];
            if (container.parentNode != draggableItem) {
                container.appendChild(draggableItem);
            }
        }
        else if (x < offsetPrev) {
            let prevItem = draggableItem.parentNode.parentNode;
            if (prevItem.parentNode) {
                if (prevItem.parentNode.classList.contains('mycontainer')) {
                    prevItem.parentNode.insertBefore(draggableItem, prevItem.parentNode.children[number(prevItem)+1])
                }                
            }
        }
    }
    else {

    }
});
sortable.on('drag:stop', (event) => {
    if (event.source.parentNode.parentNode.getAttribute('id') == event.source.getAttribute('id')) {
        event.originalSource.classList.remove('draggable--original');
        event.originalSource.style.display = '';
        event.originalSource.parentNode.classList.remove('draggable-container--is-dragging'); 
        let childContainer = event.originalSource.getElementsByClassName('mycontainer')[0];
        childContainer.classList.remove('draggable-container--over');
        childContainer.removeChild(event.source);
    }

    event.originalSource.classList.remove('original-source');

    setTimeout(function() {
        classes();
    }, 500)
    setTimeout(function() {
        var output = htmlToObject(document);    
    }, 1500)
});

function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
function htmlToObject(el) {
    let tree = [];
    let items = el.getElementsByClassName('mycontainer')[0].children;
    for (let i = 0; i < items.length; i++) {
        let ob = {
            elem: items[i].querySelectorAll('.block')[0].textContent.trim(),
            child: htmlToObject(items[i])
        }
        tree.push(ob);
    }
    return tree;
}
function childToHtml(ob) {
    let container = document.createElement('ul');
    container.classList.add('mycontainer');  
    let children = ob.child;
    for (let i = 0; i < children.length; i++) {
        let elem = document.createElement('li');
        elem.classList.add('item');
        id++; 
        elem.setAttribute("id", 'menu-item-'+id);

        let block = document.createElement('div');
        block.classList.add('block');
        block.innerHTML = children[i].elem;

        elem.appendChild(block); 
        let childForItem = childToHtml(children[i]);
        elem.appendChild(childForItem); 
        container.appendChild(elem); 
    }
    return container;
}
function objectToHtml(ob, mainContainer) {
    for (let i = 0; i < ob.length; i++) {
        let elem = document.createElement('li');
        elem.classList.add('item');
        id++;
        elem.setAttribute("id", 'menu-item-'+id);

        let block = document.createElement('div');
        block.classList.add('block');
        block.innerHTML = ob[i].elem;

        elem.appendChild(block); 
        let childForItem = childToHtml(ob[i]);
        elem.appendChild(childForItem); 
        mainContainer.appendChild(elem); 
    }
}
function oldClass(el) {
    let arrClasses = el.classList;      
    let oldClass = '';
    for (let i = 0; i < arrClasses.length; i++) {
      const p = arrClasses[i].indexOf('menu-item-depth-')
      if (p != -1) {
          const lv = parseInt(arrClasses[i].substring(p+16, arrClasses[i].length));
          oldClass = 'menu-item-depth-'+lv;
      }
    };
    return oldClass;
}
function newClass(el) {  
    let n = 0;
    let parent = el;
    while (parent.parentNode != undefined) {
        if (parent.classList.contains('mycontainer')) {
            n++;
        }
        parent = parent.parentNode;        
    }
    return `menu-item-depth-${n-1}`;
}
function number(el) {
    const items = child(el);
    for (let i = 0; i < items.length; i++) {
        if (items[i] == el) {
            return i+1
        }
    }
    return undefined
}
function classes() {

    let items = document.getElementsByClassName('mycontainer')[0].getElementsByClassName('item');
    for (let i = 0; i < items.length; i++) { 
        if (oldClass(items[i]) != '') {
            items[i].classList.remove(oldClass(items[i]));
        }
        items[i].classList.add(newClass(items[i]));
    }
}
function child(el) {
    const items = [];
    for (let i = 0; i < el.parentNode.childNodes.length; i++) {
        if (el.parentNode.childNodes[i].classList) {
            if (el.parentNode.childNodes[i].classList.contains('item')) {
                items.push(el.parentNode.childNodes[i]);
            }            
        }
    }
    return items
}
function previous(el) {
    const items = child(el);
    const n = number(el) - 2;
    return items[n]
}