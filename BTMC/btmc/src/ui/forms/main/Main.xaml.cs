using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using btmc.src.ui.forms.main.components;

namespace btmc
{
    public partial class Main : Window
    {
        private enum _TabEnum { BTMC, TERN };
        private _TabEnum _activeTab = _TabEnum.BTMC;

        public Main()
        {
            InitializeComponent();
            DataContext = this;
            _activeTab = _TabEnum.BTMC;
        }

        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ButtonState == MouseButtonState.Pressed)
                DragMove();
        }

        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void BtnMinimize_Click(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }

        private void TcMain_SectionChanged(object sender, RoutedEventArgs e)
        {
            if (tcMain.SelectedIndex == 0)
                _activeTab = _TabEnum.BTMC;
            else if (tcMain.SelectedIndex == 1)
                _activeTab = _TabEnum.TERN;
        }

        private void BtnClean_Click(object sender, RoutedEventArgs e)
        {
            switch (_activeTab)
            {
                case _TabEnum.BTMC:
                    TextBox[] btmcInputs = new TextBox[]
                    {
                        BTMCLayout.InputTextBox,
                        BTMCLayout.OutputTextBox
                    };
                    Clear.ClearInputs(ref btmcInputs);
                    break;

                case _TabEnum.TERN:
                    TextBox[] ternInputs = new TextBox[]
                    {
                        TERNLayout.input1,
                        TERNLayout.input2,
                        TERNLayout.output
                    };
                    Clear.ClearInputs(ref ternInputs);
                    break;
            }
        }



        private void BtnConvert_Click(object sender, RoutedEventArgs e)
        {
            switch (_activeTab)
            {
                case _TabEnum.BTMC:
                    // TODO: implement BTMC conversion
                    break;

                case _TabEnum.TERN:
                    // TODO: implement TERN conversion
                    break;
            }
        }
    }
}
