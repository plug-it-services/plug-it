import 'Action.dart';
import 'Trigger.dart';

class Service {
  List<Trigger> triggers = [];
  List<Action> actions = [];
  String name;
  String id;
  bool connected;
  Uri icon;

  Service({required this.name, required this.id, required this.connected, required this.icon});
}