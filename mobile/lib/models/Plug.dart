
import 'dart:ui';
import 'Action.dart';
import 'Trigger.dart';

class Plug {
  String? id;
  String? name;
  bool? activated;
  Color? color;
  Trigger? trigger;
  List<Event>? actions;
  List<String>? icons;
}