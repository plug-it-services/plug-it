
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/models/Event.dart';
import 'package:quiver/collection.dart';

import 'package:mobile/models/service/Service.dart';
import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/plug/PlugEvent.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';

import 'package:mobile/ui-toolkit/cards/ActionEditCard.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';
import '../../ui-toolkit/buttons/ScreenWidthButton.dart';

class PlugEdit extends StatefulWidget {
  final Plug? selectedPlug;
  final List<Service> services;
  final bool editing;
  final void Function() onEditEnd;

  const PlugEdit({super.key,
    this.selectedPlug,
    required this.services,
    required this.editing,
    required this.onEditEnd,
  });

  @override
  State<PlugEdit> createState() => PlugEditState();
}

class PlugEditState extends State<PlugEdit> {
  bool cardOpen = true;
  int cardIdxOpen = -1;

  PlugDetails? plugEdited;
  List<Widget> cards = [];



  void _addAction(int idx) {
    setState(() {
      plugEdited!.actions.insert(idx + 1, PlugEvent(id: '', serviceName: '', fields: [],));
      cardIdxOpen = idx + 1;
      cardOpen = true;
      setActionCards();
    });
  }

  void _deleteAction(int idx) {
    setState(() {
      plugEdited!.actions.removeAt(idx);
      if (idx == cardIdxOpen) {
        cardIdxOpen = -1;
        cardOpen = false;
      }
    });
    setActionCards();
  }

  void _savePlug() {
    if (!widget.editing) {
      PlugApi.createPlug(plugEdited!).then((value) {
        _cancel();
      });
    } else {
      PlugApi.editPlug(plugEdited!).then((value) {
        _cancel();
      });
    }
  }

  void _cancel() {
    widget.onEditEnd();
  }

  void _delete() {
    if (widget.editing) {
      PlugApi.deletePlug(plugEdited!.id).then((value) => {
        _cancel()
      });
    }
  }

  void deployCard(int idx)
  {
    if (idx != cardIdxOpen) {
      setState(() {
        cardIdxOpen = idx;
        cardOpen = true;
      });
    } else {
      setState(() {
        cardOpen = !cardOpen;
      });
    }
    setActionCards();
  }

  @override
  void initState() {
    if (widget.selectedPlug != null) {
      PlugApi.getPlug(widget.selectedPlug!.id).then((plug) {
        setState(() {
          plugEdited = plug;
        });
        setActionCards();
      });
    }
    else {
      setState(() {
        plugEdited = PlugDetails(
          id: '',
          name: '',
          event: PlugEvent(id: '', serviceName: '', fields: []),
          enabled: true,
          actions: [],
        );
        setActionCards();
      });
    }
    super.initState();
  }

  void setActionCards()
  {
    List<Widget> widgets = [];
    setState(() {
      cards.clear();
    });

    for (int index = -1; index < plugEdited!.actions.length; ++index) {
      widgets.add(ActionEditCard(
        services: widget.services,
        isOpen: cardIdxOpen == index && cardOpen,
        onCardDeploy: () => deployCard(index),
        plug: plugEdited!,
        editedEvent: (index == -1) ? plugEdited!.event : plugEdited!.actions[index],
        onServiceSelected: (Service service) {
          if (index == -1) {
            plugEdited!.event.serviceName = service.name;
            plugEdited!.event.id = '';
            plugEdited!.event.fields = [];
          }
          else {
            plugEdited!.actions[index].serviceName = service.name;
            plugEdited!.actions[index].id = '';
            plugEdited!.actions[index].fields = [];
          }
        },
        onEventSelected: (Event? event, Service service) {
          if (event == null) {
            if (index == -1) {
              plugEdited!.event.id = '';
              plugEdited!.event.fields = [];
            }
            else {
              plugEdited!.actions[index].id = '';
              plugEdited!.actions[index].fields = [];
            }
            return;
          }
          var ev = PlugEvent.fromEventService(event: event, serviceName: service.name);
          if (index == -1) {
            plugEdited!.event.id = ev.id;
            plugEdited!.event.fields = ev.fields;
          }
          else {
            plugEdited!.actions[index].id = ev.id;
            plugEdited!.actions[index].fields = ev.fields;
          }
        },
        onActionDeleted: () => _deleteAction(index),
        onActionAdded: () => _addAction(index),
        isTrigger: index == -1,
      ));
      widgets.add(IconButton(
        onPressed: () => _addAction(index),
        icon: const Icon(Icons.add_rounded),
      ));
    }
    setState(() {
      cards = widgets;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [

          const SizedBox(height: 20,),
          InputField(
            hint: "Enter Plug Name",
            value: plugEdited!.name,
            onChanged: (value) => plugEdited!.name = value,
          ),
          const SizedBox(height: 20,),

          ListView(
            physics: const ScrollPhysics(
              parent: null,
            ),
            shrinkWrap: true,
            children: cards,
          ),


          Row(
              children: [
                  Expanded(
                    child:ScreenWidthButton(
                      label: 'Save',
                      color: PlugItStyle.validationColor,
                      pressedColor: PlugItStyle.secondaryColor,
                      callback: _savePlug,
                    )
                  ),

                  Expanded(
                    child:ScreenWidthButton(
                      label: 'Cancel',
                      color: PlugItStyle.primaryColor,
                      pressedColor: PlugItStyle.secondaryColor,
                      callback: _cancel,
                    ),
                  ),
                  (widget.editing) ? Expanded(
                    child:ScreenWidthButton(
                      label: 'Delete',
                      color: Colors.red,
                      pressedColor: PlugItStyle.secondaryColor,
                      callback: _delete,
                  )
                  ) : const SizedBox(width: 0,),
              ],
          ),
          const SizedBox(height: 20,)
        ],
      ),
    );
}
}